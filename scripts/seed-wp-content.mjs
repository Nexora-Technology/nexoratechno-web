#!/usr/bin/env node
/**
 * Seeds Careers + Case Studies into the dockerised WordPress instance.
 * Source of truth: src/lib/static-content.ts (data is embedded below so the
 * script runs without a TypeScript toolchain).
 *
 * Usage:  node scripts/seed-wp-content.mjs
 * Requires: docker compose stack running; container name `nexora_wordpress`.
 *
 * Idempotent: existing posts with the same slug are overwritten, not duplicated.
 */

import { execFileSync } from 'node:child_process';

const CONTAINER = 'nexora_wordpress';

// ─── Helpers ────────────────────────────────────────────────────────────────

const wp = (...args) => {
  const out = execFileSync('docker', ['exec', CONTAINER, 'wp', ...args, '--allow-root'], {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  return out.trim();
};

const wpSilent = (...args) => {
  try { return wp(...args); } catch { return ''; }
};

const blocksToHtml = (blocks) =>
  blocks.map((b) => {
    const h = `<h2>${b.h}</h2>`;
    let rest = '';
    if (b.p)    rest += `<p>${b.p}</p>`;
    if (b.list) rest += `<ul>${b.list.map((i) => `<li>${i}</li>`).join('')}</ul>`;
    return h + rest;
  }).join('\n');

const findBySlug = (postType, slug) => {
  const id = wpSilent('post', 'list', `--post_type=${postType}`, `--name=${slug}`,
    '--post_status=any', '--field=ID', '--format=ids');
  return id ? parseInt(id.split(/\s+/)[0], 10) : null;
};

const upsertPost = ({ postType, slug, title, excerpt, content, meta }) => {
  const existing = findBySlug(postType, slug);

  if (existing) {
    wp('post', 'update', String(existing),
      `--post_title=${title}`,
      `--post_content=${content}`,
      `--post_excerpt=${excerpt}`,
      '--post_status=publish');
    console.log(`  updated #${existing}  ${slug}`);
    var id = existing;
  } else {
    const idStr = wp('post', 'create',
      `--post_type=${postType}`,
      `--post_status=publish`,
      `--post_name=${slug}`,
      `--post_title=${title}`,
      `--post_content=${content}`,
      `--post_excerpt=${excerpt}`,
      '--porcelain');
    var id = parseInt(idStr, 10);
    console.log(`  created #${id}  ${slug}`);
  }

  for (const [key, value] of Object.entries(meta)) {
    wp('post', 'meta', 'update', String(id), key, String(value));
  }
  return id;
};

// ─── Data ───────────────────────────────────────────────────────────────────

const CAREERS = [
  { slug: 'senior-fullstack-engineer', title: 'Senior Fullstack Engineer',
    dept: 'Engineering', location: 'TP.HCM / Hybrid', type: 'Full-time', level: 'Senior',
    salary: '$2,500 – $4,500',
    summary: 'Dẫn dắt phát triển các sản phẩm SaaS quy mô lớn, xây dựng kiến trúc từ frontend đến backend và cố vấn cho junior.',
    body: [
      { h: 'Về vị trí', p: 'Bạn sẽ là người định hình kiến trúc kỹ thuật cho một sản phẩm SaaS phục vụ hàng triệu người dùng. Công việc trải dài từ thiết kế hệ thống, viết code production-grade, đến cố vấn kỹ thuật cho cả team.' },
      { h: 'Trách nhiệm', list: ['Thiết kế, phát triển và bảo trì các ứng dụng web fullstack','Review code, nâng cao chất lượng kỹ thuật chung của team','Làm việc cùng PM và designer để biến ý tưởng thành sản phẩm','Cố vấn, đào tạo kỹ sư junior/mid','Đóng góp vào roadmap kỹ thuật dài hạn'] },
      { h: 'Yêu cầu', list: ['4+ năm kinh nghiệm fullstack (React + Node.js hoặc tương đương)','Kinh nghiệm làm việc với PostgreSQL, Redis, hệ thống microservices','Hiểu sâu về performance, caching, và bảo mật web','Tiếng Anh đọc hiểu tài liệu kỹ thuật tốt','Tư duy sản phẩm, quan tâm đến trải nghiệm người dùng'] },
      { h: 'Quyền lợi', list: ['Lương $2,500 – $4,500 USD theo năng lực','Bảo hiểm sức khỏe premium cho cả gia đình','14 ngày phép + nghỉ lễ VN','Ngân sách học tập $1,000/năm','Hybrid linh hoạt, 2 ngày remote mỗi tuần'] },
    ],
  },
  { slug: 'ios-engineer', title: 'iOS Engineer',
    dept: 'Mobile', location: 'TP.HCM', type: 'Full-time', level: 'Mid–Senior',
    salary: '$1,800 – $3,200',
    summary: 'Xây dựng các ứng dụng iOS native trải nghiệm cao cấp, tối ưu hiệu năng và tuân thủ Human Interface Guidelines.',
    body: [
      { h: 'Về vị trí', p: 'Bạn sẽ phát triển các ứng dụng iOS thương mại cho khách hàng enterprise, tập trung vào UX tinh tế, hiệu năng và độ ổn định cao.' },
      { h: 'Yêu cầu', list: ['3+ năm phát triển iOS với Swift','Thành thạo SwiftUI, UIKit, Combine/async-await','Kinh nghiệm publish app lên App Store','Hiểu về CI/CD cho iOS (Fastlane, Xcode Cloud)'] },
      { h: 'Quyền lợi', list: ['Lương cạnh tranh $1,800 – $3,200 USD','Macbook Pro M-series + iPhone mới nhất cho dev','Tham dự WWDC hàng năm (đối với Senior)'] },
    ],
  },
  { slug: 'product-designer', title: 'Product Designer',
    dept: 'Design', location: 'TP.HCM / Remote', type: 'Full-time', level: 'Mid',
    salary: '$1,500 – $2,800',
    summary: 'Thiết kế trải nghiệm sản phẩm end-to-end — từ nghiên cứu người dùng, wireframe đến UI hi-fi và design system.',
    body: [
      { h: 'Về vị trí', p: 'Bạn làm việc cùng PM, engineer và khách hàng để biến nhu cầu kinh doanh thành trải nghiệm sản phẩm tốt.' },
      { h: 'Yêu cầu', list: ['Portfolio thể hiện ít nhất 3 sản phẩm thực tế đã ra mắt','Thành thạo Figma, có khả năng xây design system','Kỹ năng UX research cơ bản','Tư duy system thinking'] },
      { h: 'Quyền lợi', list: ['Lương $1,500 – $2,800 USD theo năng lực','Học tập $500/năm cho workshops và courses','Làm việc từ xa linh hoạt'] },
    ],
  },
  { slug: 'devops-engineer', title: 'DevOps Engineer',
    dept: 'Infrastructure', location: 'TP.HCM / Hybrid', type: 'Full-time', level: 'Senior',
    salary: '$2,200 – $4,000',
    summary: 'Vận hành hạ tầng cloud cho các sản phẩm quy mô lớn, đảm bảo độ sẵn sàng cao và bảo mật chuẩn doanh nghiệp.',
    body: [
      { h: 'Yêu cầu', list: ['4+ năm kinh nghiệm DevOps / SRE','Chứng chỉ AWS / GCP / Azure là lợi thế','Kubernetes ở mức production','Hiểu về observability (Prometheus, Grafana, Loki)','Infrastructure as Code (Terraform, Pulumi)'] },
      { h: 'Quyền lợi', list: ['Lương $2,200 – $4,000 USD theo năng lực','Thiết bị và cloud budget riêng','Conference attendance $800/năm'] },
    ],
  },
  { slug: 'qa-engineer', title: 'QA Engineer',
    dept: 'Quality', location: 'TP.HCM', type: 'Full-time', level: 'Mid',
    salary: '$1,200 – $2,200',
    summary: 'Đảm bảo chất lượng sản phẩm qua automation test, từ unit đến E2E, cho các dự án SaaS của Nexora.',
    body: [
      { h: 'Yêu cầu', list: ['2+ năm kinh nghiệm QA/automation','Thành thạo Playwright hoặc Cypress','Kinh nghiệm API testing (Postman, REST-assured)','Viết test plans và test cases rõ ràng'] },
      { h: 'Quyền lợi', list: ['Lương $1,200 – $2,200 USD theo năng lực','Học tập certification budget','Tham gia test các sản phẩm thú vị từ đầu'] },
    ],
  },
  { slug: 'project-manager', title: 'Project Manager',
    dept: 'Product', location: 'TP.HCM', type: 'Full-time', level: 'Mid–Senior',
    salary: '$1,800 – $3,000',
    summary: 'Điều phối các dự án phần mềm từ discovery đến delivery, làm việc chặt chẽ với dev và khách hàng.',
    body: [
      { h: 'Yêu cầu', list: ['3+ năm kinh nghiệm PM trong software development','Thành thạo Agile/Scrum, Jira hoặc Linear','Kỹ năng giao tiếp và quản lý kỳ vọng khách hàng','Hiểu biết cơ bản về technical stack là lợi thế'] },
      { h: 'Quyền lợi', list: ['Lương $1,800 – $3,000 USD theo năng lực','Làm việc với các dự án SaaS thú vị','Team nhỏ, ảnh hưởng trực tiếp đến sản phẩm'] },
    ],
  },
];

const CASE_STUDIES = [
  { slug: 'finstart-digital-banking', title: 'Nền tảng Digital Banking cho 2 triệu người dùng',
    client: 'Finstart', industry: 'Fintech', year: '2024', duration: '9 tháng', team: '8 người', color: '#6366F1',
    summary: 'Xây dựng hệ thống core banking cloud-native với khả năng mở rộng tuyến tính, hỗ trợ 2 triệu người dùng đồng thời.',
    body: [
      { h: 'Bối cảnh', p: 'Finstart cần hiện đại hóa hệ thống core banking legacy để đáp ứng nhu cầu mở rộng nhanh chóng với chi phí vận hành hợp lý.' },
      { h: 'Thách thức', list: ['Hệ thống monolith không thể mở rộng theo demand','Downtime cao ảnh hưởng đến khách hàng doanh nghiệp','Codebase legacy phức tạp và khó bảo trì'] },
      { h: 'Giải pháp', p: 'Nexora xây dựng kiến trúc microservices cloud-native trên AWS, migrate dần từng domain sang hệ thống mới sử dụng Strangler Fig pattern.' },
      { h: 'Kết quả', list: ['2 triệu người dùng hoạt động không gián đoạn','99.99% uptime trong 12 tháng đầu','Giảm 60% chi phí vận hành hàng tháng','API response nhanh hơn 3x so với hệ thống cũ'] },
    ],
  },
  { slug: 'logismart-supply-chain', title: 'Hệ thống Supply Chain cho chuỗi 500+ cửa hàng',
    client: 'LogisMart', industry: 'Logistics', year: '2024', duration: '12 tháng', team: '12 người', color: '#10B981',
    summary: 'Platform quản lý logistics end-to-end kết nối 500+ cửa hàng với hệ thống kho tự động.',
    body: [
      { h: 'Bối cảnh', p: 'LogisMart cần đồng bộ hoá hoạt động logistics giữa 500+ cửa hàng và 3 kho trung tâm, giảm thời gian giao hàng và tối ưu inventory.' },
      { h: 'Giải pháp', list: ['Mobile app cho driver và warehouse staff (React Native)','Backend quản lý inventory real-time với WebSocket','IoT integration với hệ thống kho tự động qua MQTT'] },
      { h: 'Kết quả', list: ['Giảm 40% chi phí logistics trong 6 tháng đầu','Độ chính xác inventory đạt 99.9%','Thời gian giao hàng trung bình giảm 25%'] },
    ],
  },
  { slug: 'medicore-health-platform', title: 'Nền tảng Telemedicine cho 50 bệnh viện',
    client: 'MediCore', industry: 'Healthcare', year: '2024', duration: '10 tháng', team: '10 người', color: '#EF4444',
    summary: 'Hệ thống telehealth kết nối bác sĩ và bệnh nhân, tích hợp EHR và booking thông minh.',
    body: [
      { h: 'Bối cảnh', p: 'MediCore cần nền tảng telehealth để mở rộng dịch vụ khám chữa bệnh từ xa, kết nối bác sĩ với bệnh nhân qua video consultation.' },
      { h: 'Giải pháp', list: ['Video consultation platform HIPAA-compliant với WebRTC','EHR integration với hệ thống bệnh viện qua HL7 FHIR API','Smart booking AI-powered giảm thời gian chờ 40%'] },
      { h: 'Kết quả', list: ['500K+ lượt tư vấn mỗi tháng sau 3 tháng','Patient satisfaction rating 4.9/5','Giảm 30% thời gian chờ khám trung bình'] },
    ],
  },
  { slug: 'retailmax-ecommerce', title: 'Hệ thống E-commerce cho 1 triệu SKUs',
    client: 'RetailMax', industry: 'E-commerce', year: '2023', duration: '8 tháng', team: '7 người', color: '#F59E0B',
    summary: 'Nền tảng thương mại điện tử xử lý 1 triệu sản phẩm với PWA, real-time inventory và thanh toán đa kênh.',
    body: [
      { h: 'Bối cảnh', p: 'RetailMax mở rộng từ 10K lên 1 triệu SKUs và cần hệ thống có khả năng mở rộng lớn mà không phải viết lại từ đầu.' },
      { h: 'Giải pháp', list: ['PWA frontend với offline support và lazy loading','Elasticsearch cho search performance với autocomplete','Multi-payment gateway integration (VNPay, MoMo, Stripe)'] },
      { h: 'Kết quả', list: ['3 triệu người mua mỗi tháng sau 4 tháng','Conversion rate tăng 50% so với platform cũ','PWA giảm bounce rate 35%, tăng engagement 2x'] },
    ],
  },
  { slug: 'greenergy-iot-dashboard', title: 'Dashboard IoT giám sát 10,000 cảm biến năng lượng',
    client: 'GreenEnergy', industry: 'Energy', year: '2023', duration: '11 tháng', team: '9 người', color: '#22C55E',
    summary: 'Hệ thống giám sát và tối ưu hóa năng lượng công nghiệp qua 10,000 cảm biến IoT.',
    body: [
      { h: 'Bối cảnh', p: 'GreenEnergy cần giám sát và tối ưu hóa tiêu thụ năng lượng trên toàn bộ nhà máy thông qua 10,000 cảm biến IoT đặt tại các điểm tiêu thụ chính.' },
      { h: 'Giải pháp', list: ['IoT gateway với edge computing trên Raspberry Pi clusters','Real-time dashboard với WebSocket và Apache Kafka','ML model cho predictive maintenance giảm unplanned downtime'] },
      { h: 'Kết quả', list: ['Giảm 25% tiêu thụ năng lượng trong 6 tháng','Predictive maintenance giảm unplanned downtime 60%','ROI đạt trong 8 tháng thay vì ước tính 18 tháng'] },
    ],
  },
  { slug: 'urbantech-smart-city', title: 'Smart City Platform cho thành phố thông minh',
    client: 'UrbanTech', industry: 'Industrial', year: '2023', duration: '14 tháng', team: '15 người', color: '#8B5CF6',
    summary: 'Tích hợp dữ liệu từ nhiều nguồn — giao thông, an ninh, môi trường — vào một dashboard unified.',
    body: [
      { h: 'Bối cảnh', p: 'UrbanTech xây dựng nền tảng smart city cho 2 thành phố lớn tại Việt Nam, tích hợp dữ liệu từ camera giao thông, cảm biến môi trường, và hệ thống quản lý đô thị.' },
      { h: 'Giải pháp', list: ['Data lake tập trung từ 50+ nguồn dữ liệu với Apache Airflow','ML model cho traffic prediction với LSTM neural networks','Unified dashboard cho city operations center hoạt động 24/7'] },
      { h: 'Kết quả', list: ['Giảm 40% tắc nghẽn giao thông trong giờ cao điểm','Incident response nhanh hơn 3x qua automated alerts','Tiết kiệm $2M chi phí vận hành/năm cho 2 thành phố'] },
    ],
  },
  { slug: 'healthtrack-wearable', title: 'App Wellness cho 100,000 người dùng wearable',
    client: 'HealthTrack', industry: 'Healthcare', year: '2022', duration: '9 tháng', team: '6 người', color: '#EC4899',
    summary: 'Ứng dụng wellness tích hợp với Apple Watch, Samsung Galaxy Watch — theo dõi sức khỏe và coaching cá nhân hóa.',
    body: [
      { h: 'Bối cảnh', p: 'HealthTrack cần app wellness cross-platform tích hợp với major wearable devices, cung cấp personalized health insights và coaching cho người dùng.' },
      { h: 'Giải pháp', list: ['React Native app với native module cho HealthKit (iOS) / Google Fit (Android)','ML model cho personalized health insights từ dữ liệu wearable','Gamification features tăng user engagement và retention'] },
      { h: 'Kết quả', list: ['100K+ active users sau 6 tháng ra mắt','App Store rating 4.8/5 với 12,000+ reviews','Users cải thiện health score trung bình 35% sau 3 tháng sử dụng'] },
    ],
  },
];

// ─── Seeder ─────────────────────────────────────────────────────────────────

console.log(`\n▶ Seeding ${CAREERS.length} careers…`);
for (const c of CAREERS) {
  upsertPost({
    postType: 'career',
    slug: c.slug,
    title: c.title,
    excerpt: c.summary,
    content: blocksToHtml(c.body),
    meta: {
      department: c.dept,
      location:   c.location,
      salary:     c.salary,
      jobType:    c.type,
      level:      c.level,
    },
  });
}

console.log(`\n▶ Seeding ${CASE_STUDIES.length} case studies…`);
for (const c of CASE_STUDIES) {
  upsertPost({
    postType: 'case_study',
    slug: c.slug,
    title: c.title,
    excerpt: c.summary,
    content: blocksToHtml(c.body),
    meta: {
      client:   c.client,
      industry: c.industry,
      year:     c.year,
      duration: c.duration,
      team:     c.team,
      color:    c.color,
    },
  });
}

console.log('\n✓ Done');
