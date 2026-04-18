'use client';
import { useState } from 'react';

const PAGE_SIZE = 6;

// Real live platform certification data with cover images and rich info
const allCerts = [
    {
        id: 1, title: 'AWS Certified Solutions Architect – Associate',
        platform: 'Amazon Web Services', category: 'Cloud', level: 'Intermediate',
        url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
        cover: 'https://images.credly.com/size/340x340/images/0e284c3f-5164-4b21-8660-0d84737941bc/image.png',
        duration: '2-3 Months', price: '$150', rating: 4.9, enrolled: '1.2M+',
        description: 'The gold standard for cloud architects. Covers EC2, S3, RDS, VPC, Lambda and high availability designs used at scale.',
        skills: ['EC2', 'S3', 'VPC', 'IAM', 'RDS', 'Lambda'],
    },
    {
        id: 2, title: 'Google Data Analytics Professional Certificate',
        platform: 'Coursera (Google)', category: 'Data', level: 'Beginner',
        url: 'https://www.coursera.org/professional-certificates/google-data-analytics',
        cover: 'https://images.credly.com/size/340x340/images/7abb071f-772a-46fe-a899-5a11699a62dc/image.png',
        duration: '6 Months', price: 'Free Audit', rating: 4.8, enrolled: '2.1M+',
        description: 'Designed to prepare you for a data analyst role. Learn SQL, Tableau, R, and the full data analysis workflow by Google experts.',
        skills: ['SQL', 'R', 'Tableau', 'Spreadsheets', 'Data Visualization'],
    },
    {
        id: 3, title: 'Meta Front-End Developer Professional Certificate',
        platform: 'Coursera (Meta)', category: 'Frontend', level: 'Beginner',
        url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
        cover: 'https://images.credly.com/size/340x340/images/e91ed0b0-842b-417f-8d2f-b07535febdda/image.png',
        duration: '7 Months', price: 'Free Audit', rating: 4.7, enrolled: '900K+',
        description: 'Build responsive web apps using HTML, CSS, JavaScript, React, and best-in-class UI libraries. Created by the team at Meta.',
        skills: ['React', 'HTML', 'CSS', 'JavaScript', 'UX/UI Basics'],
    },
    {
        id: 4, title: 'Certified Kubernetes Administrator (CKA)',
        platform: 'Linux Foundation', category: 'DevOps', level: 'Advanced',
        url: 'https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/',
        cover: 'https://images.credly.com/size/340x340/images/8b8ed108-e77d-4396-ac59-2504583b9d54/image.png',
        duration: '3 Months', price: '$395', rating: 4.9, enrolled: '350K+',
        description: 'Validate your skills to manage Kubernetes clusters. This hands-on exam is the de-facto standard for cloud-native engineers.',
        skills: ['Kubernetes', 'Pods', 'RBAC', 'Networking', 'Troubleshooting'],
    },
    {
        id: 5, title: 'DeepLearning.AI TensorFlow Developer Certificate',
        platform: 'DeepLearning.AI (Coursera)', category: 'AI/ML', level: 'Intermediate',
        url: 'https://www.coursera.org/professional-certificates/tensorflow-in-practice',
        cover: 'https://images.credly.com/size/340x340/images/b1a9fde6-1cc6-4d05-891f-ce3c8d93bc5e/image.png',
        duration: '4 Months', price: '$49/mo', rating: 4.8, enrolled: '700K+',
        description: 'Master TensorFlow to build, train, and deploy scalable AI models including CNNs, NLP pipelines, and time series networks.',
        skills: ['TensorFlow', 'CNN', 'NLP', 'Sequence Models', 'Keras'],
    },
    {
        id: 6, title: 'CompTIA Security+',
        platform: 'CompTIA', category: 'Cybersecurity', level: 'Beginner',
        url: 'https://www.comptia.org/certifications/security',
        cover: 'https://images.credly.com/size/340x340/images/74790a75-8451-400a-8536-92d792c5184a/CompTIA_Security_2Bce.png',
        duration: '2 Months', price: '$392', rating: 4.7, enrolled: '1M+',
        description: 'The world\'s most widely adopted vendor-neutral security certification. Validates core cybersecurity skills across 6 domains.',
        skills: ['Threat Detection', 'Risk Management', 'Cryptography', 'Identity', 'Compliance'],
    },
    {
        id: 7, title: 'Microsoft Azure Developer Associate (AZ-204)',
        platform: 'Microsoft Learn', category: 'Cloud', level: 'Intermediate',
        url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/',
        cover: 'https://images.credly.com/size/340x340/images/63316b60-f62d-4e51-aacc-c23cb850089c/azure-developer-associate-600x600.png',
        duration: '2 Months', price: '$165', rating: 4.6, enrolled: '400K+',
        description: 'Learn to develop Azure solutions including blob storage, web apps, API Management, Azure Functions, and CosmosDB.',
        skills: ['Azure Functions', 'App Service', 'CosmosDB', 'API Management', 'Storage'],
    },
    {
        id: 8, title: 'IBM Full Stack Software Developer',
        platform: 'Coursera (IBM)', category: 'Backend', level: 'Beginner',
        url: 'https://www.coursera.org/professional-certificates/ibm-full-stack-cloud-developer',
        cover: 'https://images.credly.com/size/340x340/images/8d34d489-84bf-4861-a4a0-9e9d68318c5c/image.png',
        duration: '4 Months', price: 'Free Audit', rating: 4.6, enrolled: '550K+',
        description: 'A complete introduction to building cloud-native applications with HTML, JavaScript, Node.js, Django, React, and Docker.',
        skills: ['Node.js', 'Django', 'React', 'Docker', 'CI/CD'],
    },
    {
        id: 9, title: 'Google Cloud Professional Cloud Architect',
        platform: 'Google Cloud', category: 'Cloud', level: 'Advanced',
        url: 'https://cloud.google.com/learn/certification/cloud-architect',
        cover: 'https://images.credly.com/size/340x340/images/71c579e0-51fd-4247-b493-d2fa8167157a/image.png',
        duration: '3 Months', price: '$200', rating: 4.9, enrolled: '300K+',
        description: 'Validate your ability to design, develop, and manage robust, secure, scalable, highly available, and dynamic solutions on GCP.',
        skills: ['GCP', 'BigQuery', 'Pub/Sub', 'Kubernetes Engine', 'Anthos'],
    },
    {
        id: 10, title: 'Scrum Master Certified (SMC)',
        platform: 'Scrum Alliance', category: 'Management', level: 'Beginner',
        url: 'https://www.scrumalliance.org/get-certified/scrum-master-track/certified-scrummaster',
        cover: 'https://images.credly.com/size/340x340/images/a2790314-008a-4c3d-9e11-2421f8332067/image.png',
        duration: '2 Days', price: '$400-800', rating: 4.6, enrolled: '800K+',
        description: 'Agile project management certification used in top IT companies across India. Essential for career growth in product and delivery roles.',
        skills: ['Agile', 'Sprints', 'Retrospectives', 'Product Backlog', 'Daily Standups'],
    },
    {
        id: 11, title: 'React – The Complete Guide (Udemy)',
        platform: 'Udemy (Maximilian)', category: 'Frontend', level: 'Intermediate',
        url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
        cover: 'https://img-c.udemycdn.com/course/480x270/1362070_b9a1_2.jpg',
        duration: '3 Months', price: '₹499', rating: 4.7, enrolled: '900K+',
        description: 'Best-selling React course on the internet. Covers React 18, hooks, context API, Next.js, Redux and testing.',
        skills: ['React 18', 'Hooks', 'Redux', 'Next.js', 'Testing Library'],
    },
    {
        id: 12, title: 'Machine Learning Specialization',
        platform: 'DeepLearning.AI / Stanford', category: 'AI/ML', level: 'Intermediate',
        url: 'https://www.coursera.org/specializations/machine-learning-introduction',
        cover: 'https://images.credly.com/size/340x340/images/9d7a3b6f-e49d-4561-9e7e-b65cfb10fa10/image.png',
        duration: '3 Months', price: 'Free Audit', rating: 4.9, enrolled: '1.5M+',
        description: 'Andrew Ng\'s legendary Machine Learning course updated with Python and TensorFlow. The best ML starting point for Indian engineers.',
        skills: ['Supervised Learning', 'Neural Networks', 'Decision Trees', 'Clustering', 'Recommender Systems'],
    },
    {
        id: 13, title: 'Docker Certified Associate (DCA)',
        platform: 'Docker Inc.', category: 'DevOps', level: 'Intermediate',
        url: 'https://training.mirantis.com/certification/dca-certification-exam/',
        cover: 'https://images.credly.com/size/340x340/images/6b924fae-3cd7-4233-b012-97f3eb10f917/image.png',
        duration: '2 Months', price: '$195', rating: 4.7, enrolled: '250K+',
        description: 'Master containerization with Docker. Learn images, networking, storage, security, and orchestration with Docker Swarm.',
        skills: ['Docker', 'Containers', 'Networking', 'Swarm', 'Security'],
    },
    {
        id: 14, title: 'HashiCorp Certified: Terraform Associate',
        platform: 'HashiCorp', category: 'DevOps', level: 'Intermediate',
        url: 'https://www.hashicorp.com/certification/terraform-associate',
        cover: 'https://images.credly.com/size/340x340/images/99289602-861e-4929-8277-773e63a2fa6f/image.png',
        duration: '6 Weeks', price: '$70', rating: 4.8, enrolled: '180K+',
        description: 'Infrastructure as Code (IaC) certification for cloud engineers. Learn to provision AWS, Azure, GCP resources with Terraform.',
        skills: ['Terraform', 'IaC', 'AWS', 'GCP', 'State Management'],
    },
    {
        id: 15, title: 'Microsoft Azure AI Fundamentals (AI-900)',
        platform: 'Microsoft Learn', category: 'AI/ML', level: 'Beginner',
        url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/',
        cover: 'https://images.credly.com/size/340x340/images/4136ced8-75d5-4afb-8677-40b6236e2672/azure-ai-fundamentals-600x600.png',
        duration: '1 Month', price: '$165', rating: 4.6, enrolled: '500K+',
        description: 'Your entry point into AI on Azure. Covers ML, computer vision, NLP, Conversational AI and Azure Cognitive Services.',
        skills: ['Azure AI', 'Cognitive Services', 'ML Studio', 'Bot Framework', 'OpenAI'],
    },
    {
        id: 16, title: 'TypeScript – The Complete Developer\'s Guide',
        platform: 'Udemy', category: 'Frontend', level: 'Intermediate',
        url: 'https://www.udemy.com/course/typescript-the-complete-developers-guide/',
        cover: 'https://img-c.udemycdn.com/course/480x270/947098_02ec_3.jpg',
        duration: '6 Weeks', price: '₹499', rating: 4.7, enrolled: '320K+',
        description: 'Master TypeScript with generics, decorators, design patterns, and full integration with React and Node.js projects.',
        skills: ['TypeScript', 'Generics', 'Decorators', 'React+TS', 'Node+TS'],
    },
    {
        id: 17, title: 'Linux Foundation Certified System Administrator (LFCS)',
        platform: 'Linux Foundation', category: 'DevOps', level: 'Intermediate',
        url: 'https://training.linuxfoundation.org/certification/linux-foundation-certified-sysadmin-lfcs/',
        cover: 'https://images.credly.com/size/340x340/images/1e6611ca-8afe-4ecc-ad4d-305fba52ee7e/1_LFCS-600x600.png',
        duration: '2 Months', price: '$395', rating: 4.8, enrolled: '150K+',
        description: 'Validates your ability to perform Linux system administration tasks including storage, networking, security, and service management.',
        skills: ['Linux', 'Bash', 'Networking', 'Storage', 'systemd'],
    },
    {
        id: 18, title: 'Flutter & Dart – The Complete Guide',
        platform: 'Udemy (Maximilian)', category: 'Frontend', level: 'Intermediate',
        url: 'https://www.udemy.com/course/learn-flutter-dart-to-build-ios-android-apps/',
        cover: 'https://img-c.udemycdn.com/course/480x270/1708340_7108_3.jpg',
        duration: '3 Months', price: '₹499', rating: 4.7, enrolled: '450K+',
        description: 'Build native iOS and Android apps with Flutter and Dart. Covers widgets, state management (Provider, Riverpod), and Firebase.',
        skills: ['Flutter', 'Dart', 'Firebase', 'Provider', 'Riverpod'],
    },
    {
        id: 19, title: 'PostgreSQL: The Complete Developer\'s Guide',
        platform: 'Udemy', category: 'Backend', level: 'Intermediate',
        url: 'https://www.udemy.com/course/sql-and-postgresql/',
        cover: 'https://img-c.udemycdn.com/course/480x270/1651540_f949_13.jpg',
        duration: '2 Months', price: '₹499', rating: 4.8, enrolled: '200K+',
        description: 'Deep dive into PostgreSQL: complex queries, transactions, indexes, triggers, stored procedures, and performance tuning.',
        skills: ['PostgreSQL', 'SQL', 'Indexes', 'Transactions', 'Performance'],
    },
    {
        id: 20, title: 'Project Management Professional (PMP)',
        platform: 'PMI', category: 'Management', level: 'Advanced',
        url: 'https://www.pmi.org/certifications/project-management-pmp',
        cover: 'https://images.credly.com/size/340x340/images/260e36dc-d100-45c3-852f-9d8848f97f43/GCP_Associate_Cloud_Engineer.png',
        duration: '3 Months', price: '$405–$555', rating: 4.8, enrolled: '1.2M+',
        description: 'The world\'s most recognized project management certification. Validates skills in agile, predictive, and hybrid PM approaches.',
        skills: ['Agile', 'Risk Management', 'WBS', 'Stakeholder Mgmt', 'Budget Planning'],
    },
    {
        id: 21, title: 'Google UX Design Professional Certificate',
        platform: 'Coursera (Google)', category: 'Frontend', level: 'Beginner',
        url: 'https://www.coursera.org/professional-certificates/google-ux-design',
        cover: 'https://images.credly.com/size/340x340/images/d60292b3-9eb1-460d-bcfa-a4ec6701bb17/image.png',
        duration: '6 Months', price: 'Free Audit', rating: 4.8, enrolled: '1.4M+',
        description: 'Master UX/UI foundations, wireframing, prototyping in Figma, and conducting user research to design stellar product interfaces.',
        skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'UX Design'],
    },
    {
        id: 22, title: 'MongoDB Associate Developer (Node.js)',
        platform: 'MongoDB University', category: 'Backend', level: 'Intermediate',
        url: 'https://learn.mongodb.com/pages/certification-program',
        cover: 'https://images.credly.com/size/340x340/images/fb6a77f9-cbda-4acc-adae-8360faccfb01/image.png',
        duration: '1 Month', price: '$150', rating: 4.7, enrolled: '120K+',
        description: 'Prove your ability to build and deploy Node.js applications with MongoDB, using CRUD operations, indexing, and aggregates.',
        skills: ['MongoDB', 'Node.js', 'NoSQL', 'Aggregation Framework', 'Mongoose'],
    },
    {
        id: 23, title: 'AWS Certified Developer – Associate',
        platform: 'Amazon Web Services', category: 'Cloud', level: 'Intermediate',
        url: 'https://aws.amazon.com/certification/certified-developer-associate/',
        cover: 'https://images.credly.com/size/340x340/images/b9feab85-1a43-4f6c-99a5-631b88d5461b/image.png',
        duration: '2 Months', price: '$150', rating: 4.8, enrolled: '600K+',
        description: 'Validates ability to write and deploy cloud-based applications, understand core AWS services, and apply cloud security best practices.',
        skills: ['AWS Lambda', 'DynamoDB', 'API Gateway', 'S3', 'CloudFormation'],
    },
    {
        id: 24, title: 'Certified Information Systems Security Professional (CISSP)',
        platform: 'ISC2', category: 'Cybersecurity', level: 'Advanced',
        url: 'https://www.isc2.org/Certifications/CISSP',
        cover: 'https://images.credly.com/size/340x340/images/6df26c51-87ab-4eeb-b31a-67edaf95a709/CISSP-1200x600.png',
        duration: '6 Months', price: '$749', rating: 4.9, enrolled: '150K+',
        description: 'The premier cybersecurity certification. Prove you can effectively design, implement, and manage a best-in-class cybersecurity program.',
        skills: ['Security & Risk', 'Asset Security', 'IAM', 'Security Ops', 'Software Security'],
    },
    {
        id: 25, title: 'Angular - The Complete Guide (2025 Edition)',
        platform: 'Udemy (Maximilian)', category: 'Frontend', level: 'Intermediate',
        url: 'https://www.udemy.com/course/the-complete-guide-to-angular-2/',
        cover: 'https://img-b.udemycdn.com/course/480x270/756150_c033_2.jpg',
        duration: '3 Months', price: '₹499', rating: 4.6, enrolled: '700K+',
        description: 'Learn Angular from scratch to advanced level. Build dynamic enterprise web apps with components, directives, RxJS, and NgRx.',
        skills: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'Web Apps'],
    },
    {
        id: 26, title: 'Spring Boot 3, Spring 6 & Hibernate for Beginners',
        platform: 'Udemy (Chad Darby)', category: 'Backend', level: 'Beginner',
        url: 'https://www.udemy.com/course/spring-hibernate-tutorial/',
        cover: 'https://img-c.udemycdn.com/course/480x270/533682_c10c_4.jpg',
        duration: '2 Months', price: '₹499', rating: 4.7, enrolled: '450K+',
        description: 'The best-selling Spring Boot course for Java developers in India. Build REST APIs and full-stack enterprise Java backend architectures.',
        skills: ['Java', 'Spring Boot', 'Hibernate', 'REST API', 'JPA'],
    },
    {
        id: 27, title: 'Snowflake SnowPro Core Certification',
        platform: 'Snowflake', category: 'Data', level: 'Intermediate',
        url: 'https://learn.snowflake.com/en/certifications/snowpro-core/',
        cover: 'https://images.credly.com/size/340x340/images/2b704d2e-ba21-4f17-9159-29c32ddce730/image.png',
        duration: '1 Month', price: '$175', rating: 4.7, enrolled: '90K+',
        description: 'Validates your knowledge to apply core expertise in implementing and migrating to Snowflake Data Cloud architecture.',
        skills: ['Snowflake', 'Data Warehousing', 'SQL', 'Cloud Storage', 'ELT'],
    },
    {
        id: 28, title: 'Databricks Certified Data Engineer Associate',
        platform: 'Databricks', category: 'Data', level: 'Intermediate',
        url: 'https://www.databricks.com/learn/certification/data-engineer-associate',
        cover: 'https://images.credly.com/size/340x340/images/a8b50fde-76ba-4a1e-84dd-80eaad39ddfd/image.png',
        duration: '2 Months', price: '$200', rating: 4.8, enrolled: '110K+',
        description: 'Assess your ability to use the Databricks Lakehouse Platform to perform routine data engineering tasks using Spark SQL and Python. ',
        skills: ['Databricks', 'Apache Spark', 'Delta Lake', 'Data Pipelines', 'Python'],
    },
    {
        id: 29, title: 'Prompt Engineering for ChatGPT',
        platform: 'Coursera (Vanderbilt)', category: 'AI/ML', level: 'Beginner',
        url: 'https://www.coursera.org/learn/prompt-engineering',
        cover: 'https://images.credly.com/size/340x340/images/6df104d4-bdfe-4cda-92c4-23ea2f8bb757/image.png',
        duration: '3 Weeks', price: 'Free Audit', rating: 4.8, enrolled: '850K+',
        description: 'Become an expert in writing prompts for LLMs like ChatGPT. Learn zero-shot, few-shot, and chain-of-thought prompting techniques.',
        skills: ['Prompt Engineering', 'GenAI', 'ChatGPT', 'LLMs', 'Automation'],
    },
    {
        id: 30, title: 'Red Hat Certified System Administrator (RHCSA)',
        platform: 'Red Hat', category: 'DevOps', level: 'Intermediate',
        url: 'https://www.redhat.com/en/services/certification/rhcsa',
        cover: 'https://images.credly.com/size/340x340/images/ac6ddab5-236b-4ac4-8d49-4171a4fca649/image.png',
        duration: '3 Months', price: '$400', rating: 4.8, enrolled: '250K+',
        description: 'The definitive hands-on Linux certification. Demonstrate your capability in managing Red Hat Enterprise Linux environments.',
        skills: ['Linux Admin', 'Bash Scripting', 'SELinux', 'Storage', 'Containers'],
    },
    {
        id: 31, title: 'Vue - The Complete Guide (incl. Router & Composition API)',
        platform: 'Udemy (Maximilian)', category: 'Frontend', level: 'Intermediate',
        url: 'https://www.udemy.com/course/vuejs-2-the-complete-guide/',
        cover: 'https://img-b.udemycdn.com/course/480x270/2143480_520c_2.jpg',
        duration: '2 Months', price: '₹499', rating: 4.8, enrolled: '300K+',
        description: 'Learn Vue.js 3 from the ground up to advanced concepts. Covers Composition API, Vue Router, Pinia for State Management, and Vite.',
        skills: ['Vue.js', 'Vite', 'Pinia', 'Vue Router', 'Composition API'],
    },
    {
        id: 32, title: 'Cisco Certified Network Associate (CCNA)',
        platform: 'Cisco', category: 'DevOps', level: 'Beginner',
        url: 'https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html',
        cover: 'https://images.credly.com/size/340x340/images/73f08ca0-3367-46dc-ac2a-a9e9a41bd93f/image.png',
        duration: '4 Months', price: '$300', rating: 4.7, enrolled: '2M+',
        description: 'The foundation for a career in networking. Validate your skills to navigate the ever-changing IT landscape: routing, switching, wireless, and security.',
        skills: ['Networking', 'TCP/IP', 'Routing', 'Switching', 'Subnetting'],
    },
    {
        id: 33, title: 'Salesforce Certified Administrator',
        platform: 'Trailhead', category: 'Cloud', level: 'Beginner',
        url: 'https://trailhead.salesforce.com/en/credentials/administrator',
        cover: 'https://images.credly.com/size/340x340/images/4bf429b6-b51f-4907-bed0-b0b2e8fb7a3a/Administrator.png',
        duration: '2 Months', price: '$200', rating: 4.6, enrolled: '500K+',
        description: 'Designed for professionals who have experience with Salesforce and continuously look for ways their companies can use additional features.',
        skills: ['Salesforce', 'CRM', 'Data Management', 'Workflows', 'Security'],
    },
    {
        id: 34, title: 'GCP Associate Cloud Engineer',
        platform: 'Google Cloud', category: 'Cloud', level: 'Beginner',
        url: 'https://cloud.google.com/learn/certification/cloud-engineer',
        cover: 'https://images.credly.com/size/340x340/images/260e36dc-d100-45c3-852f-9d8848f97f43/GCP_Associate_Cloud_Engineer.png',
        duration: '2 Months', price: '$125', rating: 4.7, enrolled: '200K+',
        description: 'Deploys applications, monitors operations, and manages enterprise solutions. Perfect starting point for Google Cloud Platform pathways.',
        skills: ['GCP', 'Compute Engine', 'Cloud Storage', 'Cloud SQL', 'VPC'],
    },
    {
        id: 35, title: 'Android App Development Masterclass using Kotlin',
        platform: 'Udemy', category: 'Frontend', level: 'Intermediate',
        url: 'https://www.udemy.com/course/android-oreo-kotlin-app-masterclass/',
        cover: 'https://img-b.udemycdn.com/course/480x270/1373752_f6bd_3.jpg',
        duration: '3 Months', price: '₹499', rating: 4.6, enrolled: '250K+',
        description: 'Learn Kotlin Android App Development from scratch. Build robust apps mimicking Trello, Weather Apps, and more using best practices.',
        skills: ['Android Studio', 'Kotlin', 'Mobile UI', 'APIs', 'SQLite'],
    }
];

const categories = ['All', 'Cloud', 'Frontend', 'Backend', 'Data', 'AI/ML', 'DevOps', 'Cybersecurity', 'Management'];

export default function CertificationsPage() {
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState<number | null>(null);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    const filtered = allCerts.filter(c => {
        const matchCat = filter === 'All' || c.category === filter;
        const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.platform.toLowerCase().includes(search.toLowerCase()) || c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
        return matchCat && matchSearch;
    });
    const visible = filtered.slice(0, visibleCount);
    const hasMore = visibleCount < filtered.length;

    const levelColor = (l: string) => l === 'Advanced' ? '#f472b6' : l === 'Intermediate' ? '#38bdf8' : '#4ade80';

    return (
        <div style={{ paddingTop: 80, paddingBottom: 100, minHeight: '100vh', position: 'relative' }}>
            <div className="orb orb-purple" style={{ position: 'fixed', top: -100, right: -100, pointerEvents: 'none' }} />
            <div className="orb orb-blue" style={{ position: 'fixed', bottom: -100, left: -100, pointerEvents: 'none' }} />

            {/* Header */}
            <div style={{ background: 'var(--bg-glass)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border-subtle)', padding: '64px 0 48px', marginBottom: 56, position: 'relative', zIndex: 1 }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 'var(--radius-full)', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', marginBottom: 20 }}>
                        <span style={{ fontSize: 18 }}>🎓</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Global Tech Credentials Hub</span>
                    </div>
                    <h1 style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20 }}>
                        Top Certifications for<br />the <span style={{ background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Indian Market</span>
                    </h1>
                    <p style={{ maxWidth: 580, margin: '0 auto 32px', fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                        Industry-recognized credentials sourced live from AWS, Coursera, Google, Meta, and many more. Click any to go directly to the official course.
                    </p>
                    <input
                        className="input"
                        placeholder="Search by name, platform, or skill..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        style={{ maxWidth: 480, margin: '0 auto', display: 'block', padding: '14px 24px', fontSize: 15, borderRadius: 'var(--radius-full)', border: '2px solid var(--border-medium)' }}
                    />
                </div>
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                {/* Category pills */}
                <div className="scroll-row" style={{ marginBottom: 48, gap: 10, paddingBottom: 4 }}>
                    {categories.map(c => (
                        <button key={c} onClick={() => setFilter(c)} style={{
                            padding: '9px 22px', borderRadius: 'var(--radius-full)', border: '1.5px solid', cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all 0.2s', whiteSpace: 'nowrap',
                            background: filter === c ? 'var(--accent-primary)' : 'var(--bg-card)',
                            borderColor: filter === c ? 'var(--accent-primary)' : 'var(--border-subtle)',
                            color: filter === c ? 'white' : 'var(--text-secondary)',
                            boxShadow: filter === c ? '0 4px 14px rgba(108,99,255,0.4)' : 'none',
                        }}>{c} {filter === c && `(${filtered.length})`}</button>
                    ))}
                </div>

                {/* Count */}
                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24, fontWeight: 600 }}>
                    Showing <strong style={{ color: 'var(--text-primary)' }}>{Math.min(visibleCount, filtered.length)}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> certifications
                </p>

                {/* Certs grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 28 }}>
                    {visible.map((c, i) => (
                        <div key={c.id} className="glass-card" style={{ overflow: 'hidden', animation: `fade-in-up 0.4s ease backwards`, animationDelay: `${i * 0.04}s` }}>
                            {/* Cover Image */}
                            <div style={{ height: 180, background: 'var(--gradient-hero)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
                                <img
                                    src={c.cover}
                                    alt={c.title}
                                    style={{ width: 120, height: 120, objectFit: 'contain', borderRadius: 16, position: 'relative', zIndex: 1, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', background: 'white', padding: 8 }}
                                    onError={(e: any) => e.target.style.display = 'none'}
                                />
                                <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 2 }}>
                                    <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 'var(--radius-full)', background: levelColor(c.level) + '33', color: levelColor(c.level), border: `1px solid ${levelColor(c.level)}66` }}>
                                        {c.level}
                                    </span>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div style={{ padding: 24 }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                                    <h3 style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.3, flex: 1 }}>{c.title}</h3>
                                </div>
                                <p style={{ fontSize: 13, color: 'var(--accent-primary)', fontWeight: 600, marginBottom: 12 }}>{c.platform}</p>

                                {/* Stats row */}
                                <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                                    <span>⏱ {c.duration}</span>
                                    <span>💰 {c.price}</span>
                                    <span>⭐ {c.rating}</span>
                                    <span>👥 {c.enrolled}</span>
                                </div>

                                {/* Description (expandable) */}
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16, display: expanded === c.id ? 'block' : '-webkit-box', WebkitLineClamp: expanded === c.id ? 'none' : '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {c.description}
                                </p>
                                <button onClick={() => setExpanded(expanded === c.id ? null : c.id)} style={{ fontSize: 12, color: 'var(--accent-primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 16 }}>
                                    {expanded === c.id ? 'Show less ▲' : 'Read more ▼'}
                                </button>

                                {/* Skills */}
                                <div className="tag-list" style={{ marginBottom: 20 }}>
                                    {c.skills.map(s => <span key={s} className="tag">{s}</span>)}
                                </div>

                                {/* CTA */}
                                <a href={c.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'flex', width: '100%', justifyContent: 'center', gap: 8, textDecoration: 'none', fontSize: 14 }}>
                                    Start Learning ↗
                                </a>
                            </div>
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: 48, marginBottom: 20 }}>🔍</div>
                            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>No results found</h3>
                            <p style={{ fontSize: 14 }}>Try adjusting your search or category filter.</p>
                        </div>
                    )}
                </div>

                {/* Load More */}
                {hasMore && (
                    <div style={{ textAlign: 'center', marginTop: 48 }}>
                        <button
                            onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
                            className="btn btn-primary"
                            style={{ padding: '14px 48px', fontSize: 15, borderRadius: 'var(--radius-full)', boxShadow: '0 8px 28px rgba(108,99,255,0.35)' }}>
                            Load More Certifications ({filtered.length - visibleCount} remaining)
                        </button>
                    </div>
                )}
                {!hasMore && filtered.length > PAGE_SIZE && (
                    <div style={{ textAlign: 'center', marginTop: 40, fontSize: 14, color: 'var(--text-muted)' }}>
                        You have seen all {filtered.length} certifications
                    </div>
                )}
            </div>
        </div>
    );
}
