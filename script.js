// Mobile Menu Toggle
document.querySelector('.mobile-menu').addEventListener('click', function() {
    document.querySelector('nav ul').classList.toggle('show');
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });

        // Close mobile menu if open
        document.querySelector('nav ul').classList.remove('show');
    });
});

// Active Navigation Highlight
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// GitHub配置
const GITHUB_TOKEN = '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';
const GITHUB_USERNAME = 'chenyehuan1234';
const GITHUB_REPO = 'lxkxh';
const DATA_FILE = 'messages.json';

// Form Submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 获取表单数据
    const name = document.getElementById('name').value;
    const phone = document.getElementById('email').value;  // 注意：这里使用的是email的ID，但实际上是电话号码
    const message = document.getElementById('message').value;
    const timestamp = new Date().toISOString();
    
    // 创建消息对象
    const newMessage = {
        name: name,
        phone: phone,
        message: message,
        timestamp: timestamp
    };
    
    // 提交数据到GitHub
    submitMessageToGitHub(newMessage);
});

// 提交消息到GitHub
async function submitMessageToGitHub(newMessage) {
    try {
        // 首先获取当前文件内容
        const currentContentResponse = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${DATA_FILE}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        let messages = [];
        let sha = null;
        
        if (currentContentResponse.ok) {
            const currentContentData = await currentContentResponse.json();
            // 解码Base64内容
            const currentContent = atob(currentContentData.content);
            messages = JSON.parse(currentContent);
            sha = currentContentData.sha;
        }
        
        // 添加新消息
        messages.push(newMessage);
        
        // 准备更新内容
        const updatedContent = JSON.stringify(messages, null, 2);
        const encodedContent = btoa(unescape(encodeURIComponent(updatedContent)));
        
        // 提交更新
        const updateResponse = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${DATA_FILE}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Add new message from ${newMessage.name}`,
                content: encodedContent,
                sha: sha  // 如果是更新现有文件，需要提供sha
            })
        });
        
        if (updateResponse.ok) {
            alert('感谢您的消息！数据已成功保存到GitHub。');
            document.getElementById('contactForm').reset();
        } else {
            const errorData = await updateResponse.json();
            console.error('GitHub API Error:', errorData);
            alert('提交失败，请稍后重试。');
        }
    } catch (error) {
        console.error('Error submitting message:', error);
        alert('提交过程中出现错误，请检查网络连接后重试。');
    }
}

// Project Detail Modal
const projectDetailButtons = document.querySelectorAll('.project-detail-btn');
const projectModal = document.getElementById('projectModal');
const closeModalButtons = document.querySelectorAll('.close-modal');

const projectData = {
    1: {
        title: "基于ARDUINO手势控制的水下清洁作业机械臂",
        description: "作为一款新型防水机械臂，能够应用于水域垃圾清理工作。操作者可以穿戴装载有弯曲度传感器、加速度传感器等元件的手套实现对机械臂的手势控制，通过手臂转动、上下移动等控制机械臂的水下移动，通过手指弯曲实现末端执行器的开合，并能够使用内窥镜在电脑显示画面中有效观察水中状况，从而实现对水下垃圾的清理。",
        tech: "Arduino, C++, 3D打印, 传感器",
        duration: "2024年3月 - 2024年10月",
        mentor: "第一届陈烨寰，第一届张贵杰，第二届周瑛梓"
    },
    2: {
        title: "自行补充",
        description: "服务型机器人平台旨在为酒店、医院等场景提供智能化服务解决方案。机器人具备自主导航、语音交互、物体识别等功能，能够完成物品递送、引导服务、信息查询等任务。项目采用ROS系统作为开发框架，实现了多传感器融合与人机交互。",
        tech: "ROS, Python, C++, SLAM, NLP",
        duration: "2023年1月 - 2023年12月",
        mentor: "李博士"
    },
    3: {
        title: "自行补充",
        description: "本项目研发了一种基于CRISPR-Cas9技术的新型基因编辑工具，具有更高的精确性和安全性。通过优化引导RNA设计和Cas蛋白结构，实现了对目标基因的精准编辑，减少了脱靶效应。研究成果已申请国家发明专利一项。",
        tech: "CRISPR-Cas9, Bioinformatics, Molecular Biology",
        duration: "2022年9月 - 2023年11月",
        mentor: "王研究员"
    }
};

projectDetailButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const projectId = this.getAttribute('data-project');
        const project = projectData[projectId];

        document.getElementById('modalProjectTitle').textContent = project.title;
        document.getElementById('modalProjectDescription').textContent = project.description;
        document.getElementById('modalProjectTech').textContent = project.tech;
        document.getElementById('modalProjectDuration').textContent = project.duration;
        document.getElementById('modalProjectMentor').textContent = project.mentor;

        projectModal.style.display = 'flex';
    });
});

// Member Detail Modal
const memberDetailButtons = document.querySelectorAll('.member-detail-btn');
const memberModal = document.getElementById('memberModal');

const memberData = {
    1: {
        name: "李明轩",
        role: "社长",
        major: "计算机科学与技术",
        research: "人工智能、机器学习",
        bio: "凌逍科学会创始人之一，拥有丰富的项目管理经验。曾获得全国大学生计算机设计大赛一等奖，参与国家级大学生创新创业项目2项。擅长团队协作与技术创新。",
        contact: "limingxuan@university.edu"
    },
    2: {
        name: "张雨桐",
        role: "副社长",
        major: "生物工程",
        research: "基因工程、生物信息学",
        bio: "专注于生物技术研发，在基因编辑领域有深入研究。曾发表SCI论文1篇，参与省级科研项目1项。具备扎实的实验技能和数据分析能力。",
        contact: "zhangyutong@university.edu"
    },
    3: {
        name: "王浩然",
        role: "副社长",
        major: "电子工程",
        research: "机器人技术、自动化控制",
        bio: "机器人技术专家，主导多项智能硬件项目开发。在国家级电子设计竞赛中获得二等奖，拥有3项实用新型专利。精通嵌入式系统开发。",
        contact: "wanghaoran@university.edu"
    },
    4: {
        name: "陈思雨",
        role: "实践部成员",
        major: "机械工程",
        research: "机械设计、实验技术",
        bio: "实践部核心成员，负责实验室设备维护与实验项目执行。具有丰富的实验操作经验，能够熟练使用各种精密仪器设备。",
        contact: "chensiyu@university.edu"
    },
    5: {
        name: "刘子涵",
        role: "实践部成员",
        major: "应用化学",
        research: "化学分析、材料合成",
        bio: "化学实验专家，擅长实验室操作与数据分析。在材料合成与表征方面有深入研究，参与多项化学相关项目。",
        contact: "liuzihan@university.edu"
    },
    6: {
        name: "赵天宇",
        role: "实践部成员",
        major: "应用物理",
        research: "物理实验、光学技术",
        bio: "物理实验技术员，负责实验设计与技术实现。在光学测量与物理仿真方面有丰富经验。",
        contact: "zhaotianyu@university.edu"
    },
    7: {
        name: "孙文博",
        role: "理论部成员",
        major: "数学与应用数学",
        research: "算法设计、数学建模",
        bio: "理论部核心成员，专注于算法设计与理论建模。多次获得数学建模竞赛奖项，具备扎实的数学基础。",
        contact: "sunwenbo@university.edu"
    },
    8: {
        name: "周晓彤",
        role: "理论部成员",
        major: "统计学",
        research: "数据分析、预测模型",
        bio: "数据分析专家，专注于统计建模与预测算法研究。擅长使用R和Python进行数据处理与可视化。",
        contact: "zhouxiaotong@university.edu"
    },
    9: {
        name: "吴志强",
        role: "理论部成员",
        major: "计算机科学",
        research: "技术文档、知识管理",
        bio: "技术文档编写专家，负责项目技术文档整理与知识管理。具备优秀的文字表达与逻辑思维能力。",
        contact: "wuzhiqiang@university.edu"
    },
    10: {
        name: "郑雅文",
        role: "设计部成员",
        major: "视觉传达设计",
        research: "平面设计、品牌形象",
        bio: "视觉设计师，负责社团宣传物料设计与品牌形象维护。具有丰富的设计经验与创意能力。",
        contact: "zhengyawen@university.edu"
    },
    11: {
        name: "黄子豪",
        role: "设计部成员",
        major: "工业设计",
        research: "产品设计、用户体验",
        bio: "产品设计师，专注于产品外观设计与用户体验优化。具备扎实的设计功底与创新思维。",
        contact: "huangzihao@university.edu"
    },
    12: {
        name: "林佳怡",
        role: "设计部成员",
        major: "新媒体艺术",
        research: "数字媒体、内容创作",
        bio: "新媒体内容创作者，负责社团网站与社交媒体内容制作。擅长视频制作与数字营销。",
        contact: "linjiayi@university.edu"
    },
    13: {
        name: "张教授",
        role: "指导老师",
        major: "计算机科学与技术",
        research: "人工智能、机器学习",
        bio: "计算机科学与技术学院教授，博士生导师。主要从事机器学习、数据挖掘等领域的研究工作，发表高水平学术论文50余篇，主持国家自然科学基金项目3项。",
        contact: "zhang@university.edu"
    },
    14: {
        name: "李博士",
        role: "指导老师",
        major: "生物工程",
        research: "基因工程、生物信息学",
        bio: "生物工程学院副教授，硕士生导师。专注于基因编辑技术研究，特别是在CRISPR-Cas9系统的优化与应用方面有深入研究。指导多项国家级大学生创新创业项目。",
        contact: "li@university.edu"
    }
};

memberDetailButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const memberId = this.getAttribute('data-member');
        const member = memberData[memberId];

        document.getElementById('modalMemberName').textContent = member.name;
        document.getElementById('modalMemberRole').textContent = member.role;
        document.getElementById('modalMemberMajor').textContent = member.major;
        document.getElementById('modalMemberResearch').textContent = member.research;
        document.getElementById('modalMemberBio').textContent = member.bio;
        document.getElementById('modalMemberContact').textContent = member.contact;

        memberModal.style.display = 'flex';
    });
});

// WeChat Modal
const wechatButtons = document.querySelectorAll('.wechat-btn');
const wechatModal = document.getElementById('wechatModal');

const wechatData = {
    "li_mingxuan": "li_mingxuan_qr",
    "zhang_yutong": "zhang_yutong_qr",
    "wang_haoran": "wang_haoran_qr",
    "chen_siyu": "chen_siyu_qr",
    "liu_zihan": "liu_zihan_qr",
    "zhao_tianyu": "zhao_tianyu_qr",
    "sun_wenbo": "sun_wenbo_qr",
    "zhou_xiaotong": "zhou_xiaotong_qr",
    "wu_zhiqiang": "wu_zhiqiang_qr",
    "zheng_yawen": "zheng_yawen_qr",
    "huang_zihao": "huang_zihao_qr",
    "lin_jiayi": "lin_jiayi_qr",
    "prof_zhang": "prof_zhang_qr",
    "dr_li": "dr_li_qr"
};

wechatButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const wechatId = this.getAttribute('data-wechat');
        const phone = this.getAttribute('data-phone');

        document.getElementById('wechatID').textContent = wechatId;
        document.getElementById('contactPhone').textContent = phone;
        // 在实际应用中，这里应该设置对应用户的二维码
        document.getElementById('wechatQRCode').src = "https://via.placeholder.com/200x200?text=" + wechatId;

        wechatModal.style.display = 'flex';
    });
});

// Close Modals
closeModalButtons.forEach(button => {
    button.addEventListener('click', function() {
        projectModal.style.display = 'none';
        memberModal.style.display = 'none';
        wechatModal.style.display = 'none';
    });
});

// Close Modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === projectModal) {
        projectModal.style.display = 'none';
    }
    if (e.target === memberModal) {
        memberModal.style.display = 'none';
    }
    if (e.target === wechatModal) {
        wechatModal.style.display = 'none';
    }
});

// Schedule Tabs
const scheduleTabs = document.querySelectorAll('.schedule-tab');
const scheduleContents = document.querySelectorAll('.schedule-content');

scheduleTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');

        // Remove active class from all tabs and contents
        scheduleTabs.forEach(t => t.classList.remove('active'));
        scheduleContents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked tab and corresponding content
        this.classList.add('active');
        document.getElementById(`${tabId}-content`).classList.add('active');
    });
});
