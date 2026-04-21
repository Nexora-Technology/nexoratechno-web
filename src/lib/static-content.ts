// Shared types for blog, careers, and case-studies
export interface ContentBlock {
  h: string;
  p?: string;
  list?: string[];
}

// ── Blog ──────────────────────────────────────────────────────────────────────

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  summary: string;
  body: ContentBlock[];
  tags: string[];
  featured?: boolean;
  wpContent?: string;
}

export const STATIC_BLOG_POSTS: BlogPost[] = [
  {
    slug: 'why-we-say-no-to-projects',
    title: 'Vì sao Nexora từ chối 7/10 dự án đến với chúng tôi',
    category: 'Văn hóa công ty',
    author: 'Nguyen Hoang Long',
    authorRole: 'CEO & Founder',
    date: '12 Tháng 4, 2026',
    readTime: '6 phút đọc',
    summary: 'Làm ít hơn, làm tốt hơn. Đây là lý do chúng tôi không nhận mọi dự án — và lợi ích ngược lại mang đến cho khách hàng.',
    body: [
      { h: 'Điểm then chốt', p: 'Một studio phần mềm giỏi không phải là studio nhận nhiều dự án. Là studio chọn đúng dự án. Ở Nexora, chúng tôi từ chối khoảng 70% các cuộc trò chuyện ban đầu. Nghe thì lạ, nhưng có lý do rõ ràng.' },
      { h: 'Tại sao chọn lọc?', list: ['Chúng tôi tin chất lượng đến từ sự tập trung', 'Khi nhận quá nhiều, team bị căng và ngừng học hỏi', 'Khách hàng tốt xứng đáng có đội ngũ tốt nhất của chúng tôi', 'Nói \'không\' sớm giúp cả hai bên tiết kiệm thời gian'] },
      { h: 'Chúng tôi thường từ chối khi nào?', p: 'Khi phạm vi quá mơ hồ và khách hàng không sẵn sàng đầu tư thời gian để làm rõ. Khi ngân sách không phù hợp với kỳ vọng chất lượng. Khi đối tác không coi chúng tôi là đối tác mà là một xưởng gia công.' },
      { h: 'Lợi ích cho khách hàng chúng tôi nhận', p: 'Họ có sự chú ý không bị pha loãng. Khi bạn là 1 trong 30 dự án, bạn chỉ có 1/30 sự quan tâm. Khi bạn là 1 trong 10 dự án chúng tôi nhận, bạn có 10%.' },
    ],
    tags: ['Văn hóa công ty'],
    featured: true,
  },
  {
    slug: 'strangler-fig-legacy',
    title: 'Strangler Fig: mẫu thiết kế cứu rỗi các hệ thống cũ',
    category: 'Kỹ thuật',
    author: 'Tran Minh Khoa',
    authorRole: 'Tech Lead',
    date: '5 Tháng 4, 2026',
    readTime: '12 phút đọc',
    summary: 'Hầu hết các cuộc \'viết lại lớn\' thất bại. Strangler Fig cho phép bạn hiện đại hóa dần mà không gây gián đoạn.',
    body: [
      { h: 'Vấn đề với việc viết lại', p: 'Viết lại (big rewrite) là quyết định phổ biến nhưng tỷ lệ thành công cực thấp. Nó đánh cược toàn bộ business vào một dự án có thời gian ước tính không đáng tin.' },
      { h: 'Strangler Fig là gì?', p: 'Đặt tên theo loại cây leo dần bao quanh và thay thế cây chủ. Bạn xây hệ thống mới từ ngoài vào — mỗi lần một tính năng — thông qua một gateway định tuyến. Khi hệ thống mới đủ lớn, hệ thống cũ được gỡ bỏ.' },
      { h: 'Khi nào dùng?', list: ['Hệ thống legacy đang chạy production không thể dừng', 'Codebase lớn khó cover toàn bộ bằng test', 'Ngân sách chỉ cho phép đầu tư dần', 'Team không đủ lớn để maintain song song hai hệ thống'] },
    ],
    tags: ['Kỹ thuật', 'Legacy', 'Architecture'],
  },
  {
    slug: 'mobile-performance-sub-1s',
    title: 'Đưa thời gian khởi động mobile app xuống dưới 1 giây',
    category: 'Mobile',
    author: 'Le Thi Huong',
    authorRole: 'Senior iOS Engineer',
    date: '28 Tháng 3, 2026',
    readTime: '9 phút đọc',
    summary: 'Hiệu năng khởi động ảnh hưởng trực tiếp đến tỷ lệ giữ chân. Đây là checklist 12 điểm chúng tôi áp dụng.',
    body: [
      { h: 'Tại sao cold start quan trọng', p: 'Google tìm thấy mỗi 100ms delay khởi động giảm 7% tỷ lệ chuyển đổi. Trên mobile con số còn khắc nghiệt hơn.' },
      { h: 'Những điểm chính cần tối ưu', list: ['Lazy load modules không cần thiết lúc khởi động', 'Pre-warm JSC/Hermes engine', 'Loại bỏ init calls trong didFinishLaunching', 'Sử dụng startup tasks marking (iOS 15+)'] },
      { h: 'Kết quả thực tế', p: 'Sau khi apply checklist, app của chúng tôi giảm từ 3.2s xuống 0.8s trên iPhone 14 Pro.' },
    ],
    tags: ['Mobile', 'iOS', 'Performance'],
  },
  {
    slug: 'figma-tokens-tailwind',
    title: 'Từ Figma Tokens đến Tailwind CSS: pipeline tự động',
    category: 'Design',
    author: 'Pham Thi Mai',
    authorRole: 'Product Designer',
    date: '15 Tháng 3, 2026',
    readTime: '8 phút đọc',
    summary: 'Cách Nexora tự động hóa việc sync design tokens từ Figma sang Tailwind CSS.',
    body: [
      { h: 'Vấn đề', p: 'Design tokens thường bị lệch giữa Figma và code. Designer sửa màu, dev quên update. Cuối cùng UI không match design.' },
      { h: 'Giải pháp', p: 'Dùng Style Dictionary để generate Tailwind config tự động từ Figma Tokens plugin. Mỗi lần design thay đổi, CI pipeline tự generate và tạo PR.' },
      { h: 'Setup', list: ['Cài Style Dictionary npm package', 'Cấu hình transform Figma tokens → Style Dictionary format', 'Viết template generate tailwind.config.ts tự động'] },
    ],
    tags: ['Design', 'Figma', 'Tailwind', 'Automation'],
  },
  {
    slug: 'remote-async-work',
    title: 'Những bài học về làm việc remote từ 4 năm điều hành team phân tán',
    category: 'Văn hóa công ty',
    author: 'Nguyen Hoang Long',
    authorRole: 'CEO & Founder',
    date: '1 Tháng 3, 2026',
    readTime: '10 phút đọc',
    summary: '4 năm điều hành team ở 3 múi giờ — đây là những gì thật sự hoạt động.',
    body: [
      { h: 'Bài học #1: Viết bằng văn bản', p: 'Không phải điều gì cũng cần meeting. Việc viết rõ ràng bằng văn bản tiết kiệm thời gian và tạo documentation tự động.' },
      { h: 'Bài học #2: Over-communicate', p: 'Ở office, người khác biết bạn đang làm gì vì nhìn thấy. Remote thì không. Nên chia sẻ progress, blockers, và plans thường xuyên hơn.' },
      { h: 'Bài học #3: Async-first', list: ['Dùng video messages thay vì live meetings khi có thể', 'Thiết lập core hours chồng nhau giữa các múi giờ', 'Kỳ vọng response time rõ ràng (vd: 24h)'] },
    ],
    tags: ['Remote', 'Culture', 'Management'],
  },
  {
    slug: 'cybersecurity-smb',
    title: 'Bảo mật 101 cho startup/SMB: những gì thật sự cần làm',
    category: 'Security',
    author: 'Vo Van Tai',
    authorRole: 'Security Engineer',
    date: '20 Tháng 2, 2026',
    readTime: '11 phút đọc',
    summary: 'Danh sách kiểm tra bảo mật thực tế cho doanh nghiệp nhỏ — không phải textbook.',
    body: [
      { h: 'Tấn công phổ biến nhất', p: 'Phishing chiếm 82% các cuộc tấn công vào SMB. Tiếp theo là ransomware và credential stuffing.' },
      { h: '7 điều tối thiểu cần làm', list: ['Enable MFA everywhere (đặc biệt email, GitHub, cloud consoles)', 'Dùng password manager thay vì nhớ password', 'Backup 3-2-1: 3 bản, 2 medium khác nhau, 1 offsite', 'Patch everything within 72 hours of critical CVEs', 'Segment network — không để dev server cùng subnet với production', 'Logging và monitoring cơ bản (CloudWatch, DataDog)', 'Security awareness training (ngay cả basic)'] },
      { h: 'Những thứ không cần làm ngay', p: 'SIEM enterprise, SOC services đắt tiền, threat intelligence platform. Bắt đầu đơn giản trước.' },
    ],
    tags: ['Security', 'SMB', 'Best Practices'],
  },
];

// ── Careers ──────────────────────────────────────────────────────────────────

export interface Career {
  slug: string;
  title: string;
  dept: string;
  location: string;
  type: string;
  level: string;
  salary: string;
  tags: string[];
  summary: string;
  posted: string;
  body: ContentBlock[];
  wpContent?: string;
}

export const STATIC_CAREERS: Career[] = [
  {
    slug: 'senior-fullstack-engineer',
    title: 'Senior Fullstack Engineer',
    dept: 'Engineering',
    location: 'TP.HCM / Hybrid',
    type: 'Toàn thời gian',
    level: 'Senior',
    salary: '$2,500 – $4,500',
    tags: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    summary: 'Dẫn dắt phát triển các sản phẩm SaaS quy mô lớn, xây dựng kiến trúc từ frontend đến backend và cố vấn cho junior.',
    posted: '3 ngày trước',
    body: [
      { h: 'Về vị trí', p: 'Bạn sẽ là người định hình kiến trúc kỹ thuật cho một sản phẩm SaaS phục vụ hàng triệu người dùng. Công việc trải dài từ thiết kế hệ thống, viết code production-grade, đến cố vấn kỹ thuật cho cả team.' },
      { h: 'Trách nhiệm', list: ['Thiết kế, phát triển và bảo trì các ứng dụng web fullstack', 'Review code, nâng cao chất lượng kỹ thuật chung của team', 'Làm việc cùng PM và designer để biến ý tưởng thành sản phẩm', 'Cố vấn, đào tạo kỹ sư junior/mid', 'Đóng góp vào roadmap kỹ thuật dài hạn'] },
      { h: 'Yêu cầu', list: ['4+ năm kinh nghiệm fullstack (React + Node.js hoặc tương đương)', 'Kinh nghiệm làm việc với PostgreSQL, Redis, hệ thống microservices', 'Hiểu sâu về performance, caching, và bảo mật web', 'Tiếng Anh đọc hiểu tài liệu kỹ thuật tốt', 'Tư duy sản phẩm, quan tâm đến trải nghiệm người dùng'] },
      { h: 'Quyền lợi', list: ['Lương $2,500 – $4,500 USD theo năng lực', 'Bảo hiểm sức khỏe premium cho cả gia đình', '14 ngày phép + nghỉ lễ VN', 'Ngân sách học tập $1,000/năm', 'Hybrid linh hoạt, 2 ngày remote mỗi tuần'] },
    ],
  },
  {
    slug: 'ios-engineer',
    title: 'iOS Engineer',
    dept: 'Mobile',
    location: 'TP.HCM',
    type: 'Toàn thời gian',
    level: 'Mid–Senior',
    salary: '$1,800 – $3,200',
    tags: ['Swift', 'SwiftUI', 'Combine', 'iOS'],
    summary: 'Xây dựng các ứng dụng iOS native trải nghiệm cao cấp, tối ưu hiệu năng và tuân thủ Human Interface Guidelines.',
    posted: '1 tuần trước',
    body: [
      { h: 'Về vị trí', p: 'Bạn sẽ phát triển các ứng dụng iOS thương mại cho khách hàng enterprise, tập trung vào UX tinh tế, hiệu năng và độ ổn định cao.' },
      { h: 'Yêu cầu', list: ['3+ năm phát triển iOS với Swift', 'Thành thạo SwiftUI, UIKit, Combine/async-await', 'Kinh nghiệm publish app lên App Store', 'Hiểu về CI/CD cho iOS (Fastlane, Xcode Cloud)'] },
      { h: 'Quyền lợi', list: ['Lương cạnh tranh $1,800 – $3,200 USD', 'Macbook Pro M-series + iPhone mới nhất cho dev', 'Tham dự WWDC hàng năm (đối với Senior)'] },
    ],
  },
  {
    slug: 'product-designer',
    title: 'Product Designer',
    dept: 'Design',
    location: 'TP.HCM / Remote',
    type: 'Toàn thời gian',
    level: 'Mid',
    salary: '$1,500 – $2,800',
    tags: ['Figma', 'UX Research', 'Design Systems'],
    summary: 'Thiết kế trải nghiệm sản phẩm end-to-end — từ nghiên cứu người dùng, wireframe đến UI hi-fi và design system.',
    posted: '2 tuần trước',
    body: [
      { h: 'Về vị trí', p: 'Bạn làm việc cùng PM, engineer và khách hàng để biến nhu cầu kinh doanh thành trải nghiệm sản phẩm tốt.' },
      { h: 'Yêu cầu', list: ['Portfolio thể hiện ít nhất 3 sản phẩm thực tế đã ra mắt', 'Thành thạo Figma, có khả năng xây design system', 'Kỹ năng UX research cơ bản', 'Tư duy system thinking'] },
      { h: 'Quyền lợi', list: ['Lương $1,500 – $2,800 USD theo năng lực', 'Học tập $500/năm cho workshops và courses', 'Làm việc từ xa linh hoạt'] },
    ],
  },
  {
    slug: 'devops-engineer',
    title: 'DevOps Engineer',
    dept: 'Infrastructure',
    location: 'TP.HCM / Hybrid',
    type: 'Toàn thời gian',
    level: 'Senior',
    salary: '$2,200 – $4,000',
    tags: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD'],
    summary: 'Vận hành hạ tầng cloud cho các sản phẩm quy mô lớn, đảm bảo độ sẵn sàng cao và bảo mật chuẩn doanh nghiệp.',
    posted: '4 ngày trước',
    body: [
      { h: 'Yêu cầu', list: ['4+ năm kinh nghiệm DevOps / SRE', 'Chứng chỉ AWS / GCP / Azure là lợi thế', 'Kubernetes ở mức production', 'Hiểu về observability (Prometheus, Grafana, Loki)', 'Infrastructure as Code (Terraform, Pulumi)'] },
      { h: 'Quyền lợi', list: ['Lương $2,200 – $4,000 USD theo năng lực', 'Thiết bị và cloud budget riêng', 'Conference attendance $800/năm'] },
    ],
  },
  {
    slug: 'qa-engineer',
    title: 'QA Engineer',
    dept: 'Quality',
    location: 'TP.HCM',
    type: 'Toàn thời gian',
    level: 'Mid',
    salary: '$1,200 – $2,200',
    tags: ['Playwright', 'Jest', 'API Testing', 'CI/CD'],
    summary: 'Đảm bảo chất lượng sản phẩm qua automation test, từ unit đến E2E, cho các dự án SaaS của Nexora.',
    posted: '1 tuần trước',
    body: [
      { h: 'Yêu cầu', list: ['2+ năm kinh nghiệm QA/automation', 'Thành thạo Playwright hoặc Cypress', 'Kinh nghiệm API testing (Postman, REST-assured)', 'Viết test plans và test cases rõ ràng'] },
      { h: 'Quyền lợi', list: ['Lương $1,200 – $2,200 USD theo năng lực', 'Học tập certification budget', 'Tham gia test các sản phẩm thú vị từ đầu'] },
    ],
  },
  {
    slug: 'project-manager',
    title: 'Project Manager',
    dept: 'Product',
    location: 'TP.HCM',
    type: 'Toàn thời gian',
    level: 'Mid–Senior',
    salary: '$1,800 – $3,000',
    tags: ['Agile', 'Jira', 'Communication', 'SaaS'],
    summary: 'Điều phối các dự án phần mềm từ discovery đến delivery, làm việc chặt chẽ với dev và khách hàng.',
    posted: '3 tuần trước',
    body: [
      { h: 'Yêu cầu', list: ['3+ năm kinh nghiệm PM trong software development', 'Thành thạo Agile/Scrum, Jira hoặc Linear', 'Kỹ năng giao tiếp và quản lý kỳ vọng khách hàng', 'Hiểu biết cơ bản về technical stack là lợi thế'] },
      { h: 'Quyền lợi', list: ['Lương $1,800 – $3,000 USD theo năng lực', 'Làm việc với các dự án SaaS thú vị', 'Team nhỏ, ảnh hưởng trực tiếp đến sản phẩm'] },
    ],
  },
];

// ── Case Studies ────────────────────────────────────────────────────────────────

export interface CaseMetric {
  value: string;
  label: string;
}

export interface CaseStudy {
  slug: string;
  client: string;
  industry: string;
  title: string;
  summary: string;
  services: string[];
  year: number;
  duration: string;
  team: string;
  color: string;
  metrics: CaseMetric[];
  body: ContentBlock[];
  wpContent?: string;
}

export const STATIC_CASES: CaseStudy[] = [
  {
    slug: 'finstart-digital-banking',
    client: 'Finstart',
    industry: 'Fintech',
    title: 'Nền tảng Digital Banking cho 2 triệu người dùng',
    summary: 'Xây dựng hệ thống core banking cloud-native với khả năng mở rộng tuyến tính, hỗ trợ 2 triệu người dùng đồng thời.',
    services: ['Backend', 'Cloud', 'Security'],
    year: 2024,
    duration: '9 tháng',
    team: '8 người',
    color: '#6366F1',
    metrics: [
      { value: '2M+', label: 'Người dùng hoạt động' },
      { value: '99.99%', label: 'Uptime SLA' },
      { value: '<200ms', label: 'API response time' },
      { value: '3x', label: 'Nhanh hơn hệ thống cũ' },
    ],
    body: [
      { h: 'Bối cảnh', p: 'Finstart cần hiện đại hóa hệ thống core banking legacy để đáp ứng nhu cầu mở rộng nhanh chóng với chi phí vận hành hợp lý.' },
      { h: 'Thách thức', list: ['Hệ thống monolith không thể mở rộng theo demand', 'Downtime cao ảnh hưởng đến khách hàng doanh nghiệp', 'Codebase legacy phức tạp và khó bảo trì'] },
      { h: 'Giải pháp', p: 'Nexora xây dựng kiến trúc microservices cloud-native trên AWS, migrate dần từng domain sang hệ thống mới sử dụng Strangler Fig pattern.' },
      { h: 'Kết quả', list: ['2 triệu người dùng hoạt động không gián đoạn', '99.99% uptime trong 12 tháng đầu', 'Giảm 60% chi phí vận hành hàng tháng', 'API response nhanh hơn 3x so với hệ thống cũ'] },
    ],
  },
  {
    slug: 'logismart-supply-chain',
    client: 'LogisMart',
    industry: 'Logistics',
    title: 'Hệ thống Supply Chain cho chuỗi 500+ cửa hàng',
    summary: 'Platform quản lý logistics end-to-end kết nối 500+ cửa hàng với hệ thống kho tự động.',
    services: ['Mobile', 'Backend', 'IoT'],
    year: 2024,
    duration: '12 tháng',
    team: '12 người',
    color: '#10B981',
    metrics: [
      { value: '500+', label: 'Cửa hàng kết nối' },
      { value: '40%', label: 'Giảm chi phí logistics' },
      { value: 'Real-time', label: 'Visibility toàn chain' },
      { value: '99.9%', label: 'Độ chính xác inventory' },
    ],
    body: [
      { h: 'Bối cảnh', p: 'LogisMart cần đồng bộ hoá hoạt động logistics giữa 500+ cửa hàng và 3 kho trung tâm, giảm thời gian giao hàng và tối ưu inventory.' },
      { h: 'Giải pháp', list: ['Mobile app cho driver và warehouse staff (React Native)', 'Backend quản lý inventory real-time với WebSocket', 'IoT integration với hệ thống kho tự động qua MQTT'] },
      { h: 'Kết quả', list: ['Giảm 40% chi phí logistics trong 6 tháng đầu', 'Độ chính xác inventory đạt 99.9%', 'Thời gian giao hàng trung bình giảm 25%'] },
    ],
  },
  {
    slug: 'medicore-health-platform',
    client: 'MediCore',
    industry: 'Healthcare',
    title: 'Nền tảng Telemedicine cho 50 bệnh viện',
    summary: 'Hệ thống telehealth kết nối bác sĩ và bệnh nhân, tích hợp EHR và booking thông minh.',
    services: ['Web', 'Mobile', 'Security'],
    year: 2024,
    duration: '10 tháng',
    team: '10 người',
    color: '#EF4444',
    metrics: [
      { value: '50+', label: 'Bệnh viện triển khai' },
      { value: '500K+', label: 'Lượt tư vấn/tháng' },
      { value: 'HIPAA', label: 'Compliance' },
      { value: '4.9/5', label: 'Rating bệnh nhân' },
    ],
    body: [
      { h: 'Bối cảnh', p: 'MediCore cần nền tảng telehealth để mở rộng dịch vụ khám chữa bệnh từ xa, kết nối bác sĩ với bệnh nhân qua video consultation.' },
      { h: 'Giải pháp', list: ['Video consultation platform HIPAA-compliant với WebRTC', 'EHR integration với hệ thống bệnh viện qua HL7 FHIR API', 'Smart booking AI-powered giảm thời gian chờ 40%'] },
      { h: 'Kết quả', list: ['500K+ lượt tư vấn mỗi tháng sau 3 tháng', 'Patient satisfaction rating 4.9/5', 'Giảm 30% thời gian chờ khám trung bình'] },
    ],
  },
  {
    slug: 'retailmax-ecommerce',
    client: 'RetailMax',
    industry: 'E-commerce',
    title: 'Hệ thống E-commerce cho 1 triệu SKUs',
    summary: 'Nền tảng thương mại điện tử xử lý 1 triệu sản phẩm với PWA, real-time inventory và thanh toán đa kênh.',
    services: ['Frontend', 'Backend', 'Cloud'],
    year: 2023,
    duration: '8 tháng',
    team: '7 người',
    color: '#F59E0B',
    metrics: [
      { value: '1M+', label: 'SKUs quản lý' },
      { value: '3M+', label: 'Người mua/tháng' },
      { value: '50%', label: 'Tăng conversion rate' },
      { value: 'PWA', label: 'App-like experience' },
    ],
    body: [
      { h: 'Bối cảnh', p: 'RetailMax mở rộng từ 10K lên 1 triệu SKUs và cần hệ thống có khả năng mở rộng lớn mà không phải viết lại từ đầu.' },
      { h: 'Giải pháp', list: ['PWA frontend với offline support và lazy loading', 'Elasticsearch cho search performance với autocomplete', 'Multi-payment gateway integration (VNPay, MoMo, Stripe)'] },
      { h: 'Kết quả', list: ['3 triệu người mua mỗi tháng sau 4 tháng', 'Conversion rate tăng 50% so với platform cũ', 'PWA giảm bounce rate 35%, tăng engagement 2x'] },
    ],
  },
  {
    slug: 'greenergy-iot-dashboard',
    client: 'GreenEnergy',
    industry: 'Energy',
    title: 'Dashboard IoT giám sát 10,000 cảm biến năng lượng',
    summary: 'Hệ thống giám sát và tối ưu hóa năng lượng công nghiệp qua 10,000 cảm biến IoT.',
    services: ['IoT', 'Dashboard', 'Analytics'],
    year: 2023,
    duration: '11 tháng',
    team: '9 người',
    color: '#22C55E',
    metrics: [
      { value: '10K+', label: 'Cảm biến IoT' },
      { value: '25%', label: 'Giảm tiêu thụ năng lượng' },
      { value: 'Real-time', label: 'Dashboard monitoring' },
      { value: 'AI', label: 'Predictive maintenance' },
    ],
    body: [
      { h: 'Bối cảnh', p: 'GreenEnergy cần giám sát và tối ưu hóa tiêu thụ năng lượng trên toàn bộ nhà máy thông qua 10,000 cảm biến IoT đặt tại các điểm tiêu thụ chính.' },
      { h: 'Giải pháp', list: ['IoT gateway với edge computing trên Raspberry Pi clusters', 'Real-time dashboard với WebSocket và Apache Kafka', 'ML model cho predictive maintenance giảm unplanned downtime'] },
      { h: 'Kết quả', list: ['Giảm 25% tiêu thụ năng lượng trong 6 tháng', 'Predictive maintenance giảm unplanned downtime 60%', 'ROI đạt trong 8 tháng thay vì ước tính 18 tháng'] },
    ],
  },
  {
    slug: 'urbantech-smart-city',
    client: 'UrbanTech',
    industry: 'Industrial',
    title: 'Smart City Platform cho thành phố thông minh',
    summary: 'Tích hợp dữ liệu từ nhiều nguồn — giao thông, an ninh, môi trường — vào một dashboard unified.',
    services: ['Full-stack', 'Data', 'Cloud'],
    year: 2023,
    duration: '14 tháng',
    team: '15 người',
    color: '#8B5CF6',
    metrics: [
      { value: '50+', label: 'Data sources tích hợp' },
      { value: '40%', label: 'Giảm tắc nghẽn giao thông' },
      { value: '24/7', label: 'City operations center' },
      { value: '3x', label: 'Nhanh hơn incident response' },
    ],
    body: [
      { h: 'Bối cảnh', p: 'UrbanTech xây dựng nền tảng smart city cho 2 thành phố lớn tại Việt Nam, tích hợp dữ liệu từ camera giao thông, cảm biến môi trường, và hệ thống quản lý đô thị.' },
      { h: 'Giải pháp', list: ['Data lake tập trung từ 50+ nguồn dữ liệu với Apache Airflow', 'ML model cho traffic prediction với LSTM neural networks', 'Unified dashboard cho city operations center hoạt động 24/7'] },
      { h: 'Kết quả', list: ['Giảm 40% tắc nghẽn giao thông trong giờ cao điểm', 'Incident response nhanh hơn 3x qua automated alerts', 'Tiết kiệm $2M chi phí vận hành/năm cho 2 thành phố'] },
    ],
  },
  {
    slug: 'healthtrack-wearable',
    client: 'HealthTrack',
    industry: 'Healthcare',
    title: 'App Wellness cho 100,000 người dùng wearable',
    summary: 'Ứng dụng wellness tích hợp với Apple Watch, Samsung Galaxy Watch — theo dõi sức khỏe và coaching cá nhân hóa.',
    services: ['Mobile', 'Backend', 'AI'],
    year: 2022,
    duration: '9 tháng',
    team: '6 người',
    color: '#EC4899',
    metrics: [
      { value: '100K+', label: 'Người dùng active' },
      { value: '4.8/5', label: 'App Store rating' },
      { value: '35%', label: 'Cải thiện health score' },
      { value: 'AI', label: 'Personalized coaching' },
    ],
    body: [
      { h: 'Bối cảnh', p: 'HealthTrack cần app wellness cross-platform tích hợp với major wearable devices, cung cấp personalized health insights và coaching cho người dùng.' },
      { h: 'Giải pháp', list: ['React Native app với native module cho HealthKit (iOS) / Google Fit (Android)', 'ML model cho personalized health insights từ dữ liệu wearable', 'Gamification features tăng user engagement và retention'] },
      { h: 'Kết quả', list: ['100K+ active users sau 6 tháng ra mắt', 'App Store rating 4.8/5 với 12,000+ reviews', 'Users cải thiện health score trung bình 35% sau 3 tháng sử dụng'] },
    ],
  },
];
