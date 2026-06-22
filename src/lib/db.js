import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  port: parseInt(process.env.DB_PORT || '3306', 10),
};

let pool;

export async function initDb() {
  if (pool) return;
  try {
    // 1. Connect without database to create it if it doesn't exist
    const connection = await mysql.createConnection(dbConfig);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_DATABASE || 'sawariya_db'}\``);
    await connection.end();

    // 2. Create the connection pool with the database specified
    pool = mysql.createPool({
      ...dbConfig,
      database: process.env.DB_DATABASE || 'sawariya_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    console.log('MySQL Connection Pool Initialized.');

    // 3. Create tables
    await createTables();
    
    // 4. Seed default data
    await seedData();
  } catch (error) {
    console.error('Database Initialization Failed:', error);
    throw error;
  }
}

async function createTables() {
  const queries = [
    `CREATE TABLE IF NOT EXISTS admin_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      refresh_token TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS settings (
      id INT PRIMARY KEY,
      site_name VARCHAR(255) NOT NULL,
      logo_url TEXT,
      favicon_url TEXT,
      primary_color VARCHAR(50) DEFAULT '#004aad',
      secondary_color VARCHAR(50) DEFAULT '#3b82f6',
      meta_title VARCHAR(255),
      meta_description TEXT,
      meta_keywords TEXT,
      facebook_url VARCHAR(255),
      instagram_url VARCHAR(255),
      linkedin_url VARCHAR(255),
      whatsapp_num VARCHAR(255),
      youtube_url VARCHAR(255),
      twitter_url VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(255),
      hours VARCHAR(255),
      address TEXT,
      map_url TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS hero (
      id INT PRIMARY KEY,
      subtitle VARCHAR(255),
      title VARCHAR(255),
      description TEXT,
      primary_cta_text VARCHAR(255),
      primary_cta_link VARCHAR(255),
      secondary_cta_text VARCHAR(255),
      secondary_cta_link VARCHAR(255),
      image_url TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS services (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      icon_name VARCHAR(100) DEFAULT 'Cpu',
      sort_order INT DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      tag VARCHAR(100),
      title VARCHAR(255) NOT NULL,
      description TEXT,
      image_url TEXT,
      benefits_json TEXT,
      cta_text VARCHAR(100),
      cta_link VARCHAR(255),
      sort_order INT DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS portfolio (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category VARCHAR(100),
      title VARCHAR(255) NOT NULL,
      client VARCHAR(255),
      description TEXT,
      image_url TEXT,
      link VARCHAR(255),
      sort_order INT DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS blogs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category VARCHAR(100),
      title VARCHAR(255) NOT NULL,
      excerpt TEXT,
      content TEXT,
      image_url TEXT,
      author VARCHAR(100) DEFAULT 'Chief Architect',
      date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS careers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      department VARCHAR(255),
      location VARCHAR(255),
      type VARCHAR(100),
      description TEXT,
      requirements_json TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS testimonials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(255),
      company VARCHAR(255),
      feedback TEXT,
      image_url TEXT,
      rating INT DEFAULT 5,
      sort_order INT DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS milestones (
      id INT AUTO_INCREMENT PRIMARY KEY,
      number VARCHAR(50) NOT NULL,
      label VARCHAR(255) NOT NULL,
      icon_name VARCHAR(100) DEFAULT 'CheckCircle',
      sort_order INT DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      company VARCHAR(255),
      service VARCHAR(255),
      message TEXT,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS applications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      job_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      resume_url TEXT,
      message TEXT,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  for (const query of queries) {
    await pool.query(query);
  }
  console.log('Database Tables Checked/Created.');
}

async function seedData() {
  // 1. Check if admin user exists, if not seed default
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM admin_users');
  if (rows[0].count === 0) {
    const defaultPasswordHash = bcrypt.hashSync('admin123', 10);
    await pool.query(
      'INSERT IGNORE INTO admin_users (username, password_hash) VALUES (?, ?)',
      ['admin', defaultPasswordHash]
    );
    console.log('Seeded default admin user: username=admin, password=admin123');
  }

  // 2. Settings seed
  const [settingsRows] = await pool.query('SELECT COUNT(*) as count FROM settings');
  if (settingsRows[0].count === 0) {
    await pool.query(`
      INSERT IGNORE INTO settings (
        id, site_name, logo_url, favicon_url, primary_color, secondary_color, 
        meta_title, meta_description, meta_keywords, 
        facebook_url, instagram_url, linkedin_url, whatsapp_num, youtube_url, twitter_url,
        email, phone, hours, address, map_url
      ) VALUES (
        1, 'Sawariya Solution', '/logo.png', '/favicon.ico', '#004aad', '#3b82f6',
        'Sawariya Solution | Enterprise Digital Consulting & Engineering',
        'Sawariya Solution is a premier digital consulting and technology services agency. We engineer high-performance systems, AI automation, and cloud solutions for global enterprises.',
        'sawariya, consulting, cloud infrastructure, AI automation, cybersecurity, custom software engineering',
        'https://facebook.com/sawariyasolution', 'https://instagram.com/sawariyasolution', 
        'https://linkedin.com/company/sawariyasolution', '+918000551065', 'https://youtube.com', 'https://twitter.com',
        'solutions@sawariyasolution.com', '+91 80005 51065', 'Mon - Sat: 9:00 AM - 7:00 PM IST',
        'Vadodara, Gujarat, India', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118147.68202029742!2d73.10304624795325!3d22.28502202636284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc8ab91a3ddab%3A0xac39d3b311572119!2sVadodara%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1687123984570!5m2!1sen!2sin'
      )
    `);
    console.log('Seeded default settings.');
  }

  // 3. Hero seed
  const [heroRows] = await pool.query('SELECT COUNT(*) as count FROM hero');
  if (heroRows[0].count === 0) {
    await pool.query(`
      INSERT IGNORE INTO hero (
        id, subtitle, title, description, primary_cta_text, primary_cta_link, secondary_cta_text, secondary_cta_link, image_url
      ) VALUES (
        1, 'Enterprise Digital Consulting', 'Engineering the Digital Future of Global Brands',
        'We deliver high-end technical consulting, bespoke enterprise solutions, and robust systems architecture that drive efficiency, scale, and long-term business growth.',
        'Book a Strategy Call', '#contact', 'Explore Services', '/services',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
      )
    `);
    console.log('Seeded default hero.');
  }

  // 4. Services seed
  const [servicesRows] = await pool.query('SELECT COUNT(*) as count FROM services');
  if (servicesRows[0].count === 0) {
    const services = [
      ['Cloud Infrastructure', 'AWS/GCP multi-cloud scaling, serverless deployment models, IaC pipeline automation utilizing Terraform, containerized deployments with Kubernetes, and CDN edge path optimization.', 'Cloud', 1],
      ['AI & Smart Automation', 'Custom LLM deployment pipelines incorporating LangChain, RAG configurations over vector indexes (Pinecone/Chroma), process automation scripts, and predictive metrics tracking.', 'Cpu', 2],
      ['Cybersecurity Systems', 'ISO 27001 alignment, Zero-Trust network setup (ZTNA), end-to-end payload encryption keys, automated firewall configuration audits, and OAuth2 security authorization setups.', 'Shield', 3],
      ['Custom Software Engineering', 'Fullstack web architectures using React/Node, highly responsive custom APIs built in Go/Rust, transactional ledgers, database replication setups, and fast page speeds.', 'Code', 4],
      ['Product Strategy', 'Detailed tech choice audits, capacity scalability modeling, UI/UX system mapping, structural logic audits, and concrete ROI/cost projections metrics.', 'TrendingUp', 5],
      ['Global Infrastructure', 'Edge server routing systems, database replication pools across geographic nodes, cloud storage optimizations, and global load balancers management.', 'Globe', 6]
    ];
    for (const s of services) {
      await pool.query(
        'INSERT INTO services (title, description, icon_name, sort_order) VALUES (?, ?, ?, ?)',
        s
      );
    }
    console.log('Seeded default services.');
  }

  // 5. Products seed
  const [productsRows] = await pool.query('SELECT COUNT(*) as count FROM products');
  if (productsRows[0].count === 0) {
    const products = [
      [
        'Platform',
        'Sawariya Apex Control Panel',
        'A unified digital control dashboard engineered for complex operations systems. It enables system administrators to manage live data streams, monitor load metrics, and deploy dynamic API keys across global microservices with sub-millisecond response latency.',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        JSON.stringify([
          'Dynamic server load monitoring & re-allocation',
          'Military-grade single sign-on (SSO) integration',
          'Advanced zero-latency visual query planner'
        ]),
        'Request Sandbox Access',
        '#contact',
        1
      ],
      [
        'Data Layer',
        'Sawariya Synapse AI Sync',
        'An automated message broker and sync network designed to keep databases across separate physical systems aligned in real time. It uses cognitive flow analysis to route payloads, resolve version conflicts, and optimize database read/write queries without server lockups.',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        JSON.stringify([
          'Automated schema synchronization and migration',
          'Smart conflict resolution algorithms',
          'End-to-end data encryption in transit & rest'
        ]),
        'View API Documentation',
        '#contact',
        2
      ]
    ];
    for (const p of products) {
      await pool.query(
        'INSERT INTO products (tag, title, description, image_url, benefits_json, cta_text, cta_link, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        p
      );
    }
    console.log('Seeded default products.');
  }

  // 6. Milestones seed
  const [milestoneRows] = await pool.query('SELECT COUNT(*) as count FROM milestones');
  if (milestoneRows[0].count === 0) {
    const milestones = [
      ['480+', 'Completed Builds', 'CheckSquare', 1],
      ['200+', 'Enterprise Clients', 'Briefcase', 2],
      ['12+', 'Years of Experience', 'Award', 3],
      ['85%', 'Client Growth %', 'TrendingUp', 4]
    ];
    for (const m of milestones) {
      await pool.query(
        'INSERT INTO milestones (number, label, icon_name, sort_order) VALUES (?, ?, ?, ?)',
        m
      );
    }
    console.log('Seeded default milestones.');
  }

  // 7. Testimonials seed
  const [testimonialRows] = await pool.query('SELECT COUNT(*) as count FROM testimonials');
  if (testimonialRows[0].count === 0) {
    const testimonials = [
      ['Sarah Jenkins', 'VP of Product', 'Apex Systems', 'Sawariya Solution completely overhauled our server management strategy. We transitioned from expensive monolith databases to multi-region cloud clusters. Our payload speed increased by 40% while operating costs were slashed by almost half.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', 5, 1],
      ['Marcus Chen', 'Director of Architecture', 'Equinox Finance', 'As a financial technology developer, database compliance is our biggest hurdle. Yash and the Sawariya engineering team constructed a custom zero-knowledge data replication system that solved our auditing bottlenecks instantly.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', 5, 2],
      ['Alaina Vance', 'Founder', 'Spark Creative', 'Working with Sawariya was an amazing experience. They acted as a true strategic partner, not just code executors. Their consulting saved us months of development cycles during our cloud migration phase.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', 5, 3]
    ];
    for (const t of testimonials) {
      await pool.query(
        'INSERT INTO testimonials (name, role, company, feedback, image_url, rating, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
        t
      );
    }
    console.log('Seeded default testimonials.');
  }

  // 8. Blogs seed
  const [blogRows] = await pool.query('SELECT COUNT(*) as count FROM blogs');
  if (blogRows[0].count === 0) {
    const blogs = [
      [
        'Cloud Scaling',
        'Migrating Monolithic Databases to Serverless Graph Databases',
        'Explore the exact strategies we used to transition a global logistics partner from an expensive oracle SQL core to serverless graph nodes.',
        'Migrating databases can feel like open-heart surgery on your product. However, as scaling requirements increase, relational database limits become scaling bottlenecks. This article breaks down our transition of a large logistics system from SQL server instances to serverless graph databases, increasing transaction velocity by 300% and minimizing network roundtrips.',
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
        'Yashwardhan Sharma',
        '2026-06-12'
      ],
      [
        'Automation',
        'Securing Cognitive Pipelines in Automated Enterprise Workflows',
        'How to deploy automated pipelines with zero vulnerability risks. Check out the basic validation layers required for systems integrity.',
        'Cognitive automated pipelines present unique threat surfaces. In this post, we share our design framework for wrapping automation executors in sandboxed configurations, protecting internal storage databases and keys from prompt injections and unauthenticated payload inputs.',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
        'Yashwardhan Sharma',
        '2026-05-28'
      ],
      [
        'Cybersecurity',
        'Designing Zero-Trust Access Systems for Remote Infrastructures',
        'Zero-Trust is not just a marketing buzzword. It is a vital framework. Here is our architectural design breakdown for secure networks.',
        'As corporate perimeters expand, perimeter-based firewall strategies fail. Zero-Trust Access (ZTA) ensures that every single network handshake is authenticated, authorized, and continuously validated. Learn how to configure ZTA configurations for remote DevOps architectures.',
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
        'Yashwardhan Sharma',
        '2026-05-15'
      ]
    ];
    for (const b of blogs) {
      await pool.query(
        'INSERT INTO blogs (category, title, excerpt, content, image_url, author, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
        b
      );
    }
    console.log('Seeded default blogs.');
  }

  // 9. Careers seed
  const [careerRows] = await pool.query('SELECT COUNT(*) as count FROM careers');
  if (careerRows[0].count === 0) {
    const careers = [
      [
        'Senior Cloud Architect',
        'Engineering',
        'Vadodara, India (Hybrid)',
        'Full-Time',
        'We are seeking a Senior Cloud Architect to design and implement multi-region Kubernetes clusters, Serverless application architectures, and infrastructure-as-code automation. You will lead client digital transformations and collaborate closely with our systems engineers.',
        JSON.stringify([
          '7+ years experience in AWS/GCP architecture',
          'Proficiency with Terraform, Docker, and Kubernetes',
          'Strong understanding of Zero-Trust Security networks',
          'Excellent client consulting and presentation skills'
        ])
      ],
      [
        'Senior AI Systems Engineer',
        'AI & Automation',
        'Vadodara, India (Hybrid)',
        'Full-Time',
        'Join our smart automation team to deploy and orchestrate large language models (LLMs), build retrieval-augmented generation (RAG) pipelines, and integrate cognitive tools with legacy systems.',
        JSON.stringify([
          '4+ years working with Python, LangChain, and vector databases',
          'Experience fine-tuning models and deploying in production',
          'Understanding of Node.js, Next.js, and API routing'
        ])
      ]
    ];
    for (const c of careers) {
      await pool.query(
        'INSERT INTO careers (title, department, location, type, description, requirements_json) VALUES (?, ?, ?, ?, ?, ?)',
        c
      );
    }
    console.log('Seeded default careers.');
  }

  // 10. Portfolio seed
  const [portfolioRows] = await pool.query('SELECT COUNT(*) as count FROM portfolio');
  if (portfolioRows[0].count === 0) {
    const portfolio = [
      [
        'Cloud Migration',
        'Apex Global Logistics Sync',
        'Apex Systems',
        'Transitioned a monolithic logistical tracking framework to serverless microservices on AWS, saving 40% on operating costs and increasing read speeds by 3x.',
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
        'https://sawariyasolution.com',
        1
      ],
      [
        'FinTech Audit Platform',
        'Zero-Knowledge Ledger Compliance',
        'Equinox Finance',
        'Designed a secure zero-knowledge proof ledger synchronization mechanism to audit compliance without leaking transaction detail records.',
        'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
        'https://sawariyasolution.com',
        2
      ]
    ];
    for (const p of portfolio) {
      await pool.query(
        'INSERT INTO portfolio (category, title, client, description, image_url, link, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
        p
      );
    }
    console.log('Seeded default portfolio.');
  }
}

export async function query(sql, params) {
  if (!pool) {
    await initDb();
  }
  const [results] = await pool.execute(sql, params);
  return results;
}

export async function getPool() {
  if (!pool) {
    await initDb();
  }
  return pool;
}
