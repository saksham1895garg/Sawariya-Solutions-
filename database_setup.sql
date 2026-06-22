-- ==========================================
-- SAWARIYA SOLUTION DATABASE SETUP SCRIPT
-- Target Database: MySQL 8.0+
-- Description: Creates the database, tables, and default seed data.
-- ==========================================

-- 1. Create the database
CREATE DATABASE IF NOT EXISTS `sawariya_db` 
  DEFAULT CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `sawariya_db`;

-- 2. Create the Admin Users table
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `refresh_token` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Create the Website Settings table
CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT PRIMARY KEY,
  `site_name` VARCHAR(255) NOT NULL,
  `logo_url` TEXT NULL,
  `favicon_url` TEXT NULL,
  `primary_color` VARCHAR(50) DEFAULT '#004aad',
  `secondary_color` VARCHAR(50) DEFAULT '#3b82f6',
  `meta_title` VARCHAR(255) NULL,
  `meta_description` TEXT NULL,
  `meta_keywords` TEXT NULL,
  `facebook_url` VARCHAR(255) NULL,
  `instagram_url` VARCHAR(255) NULL,
  `linkedin_url` VARCHAR(255) NULL,
  `whatsapp_num` VARCHAR(255) NULL,
  `youtube_url` VARCHAR(255) NULL,
  `twitter_url` VARCHAR(255) NULL,
  `email` VARCHAR(255) NULL,
  `phone` VARCHAR(255) NULL,
  `hours` VARCHAR(255) NULL,
  `address` TEXT NULL,
  `map_url` TEXT NULL
) ENGINE=InnoDB;

-- 4. Create the Hero Section table
CREATE TABLE IF NOT EXISTS `hero` (
  `id` INT PRIMARY KEY,
  `subtitle` VARCHAR(255) NULL,
  `title` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `primary_cta_text` VARCHAR(255) NULL,
  `primary_cta_link` VARCHAR(255) NULL,
  `secondary_cta_text` VARCHAR(255) NULL,
  `secondary_cta_link` VARCHAR(255) NULL,
  `image_url` TEXT NULL
) ENGINE=InnoDB;

-- 5. Create the Services table
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `icon_name` VARCHAR(100) DEFAULT 'Cpu',
  `sort_order` INT DEFAULT 0
) ENGINE=InnoDB;

-- 6. Create the Products table
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tag` VARCHAR(100) NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `image_url` TEXT NULL,
  `benefits_json` TEXT NULL,
  `cta_text` VARCHAR(100) NULL,
  `cta_link` VARCHAR(255) NULL,
  `sort_order` INT DEFAULT 0
) ENGINE=InnoDB;

-- 7. Create the Portfolio table
CREATE TABLE IF NOT EXISTS `portfolio` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category` VARCHAR(100) NULL,
  `title` VARCHAR(255) NOT NULL,
  `client` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `image_url` TEXT NULL,
  `link` VARCHAR(255) NULL,
  `sort_order` INT DEFAULT 0
) ENGINE=InnoDB;

-- 8. Create the Blogs table
CREATE TABLE IF NOT EXISTS `blogs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category` VARCHAR(100) NULL,
  `title` VARCHAR(255) NOT NULL,
  `excerpt` TEXT NULL,
  `content` TEXT NULL,
  `image_url` TEXT NULL,
  `author` VARCHAR(100) DEFAULT 'Chief Architect',
  `date` DATE NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 9. Create the Careers table
CREATE TABLE IF NOT EXISTS `careers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `department` VARCHAR(255) NULL,
  `location` VARCHAR(255) NULL,
  `type` VARCHAR(100) NULL,
  `description` TEXT NULL,
  `requirements_json` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 10. Create the Testimonials table
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(255) NULL,
  `company` VARCHAR(255) NULL,
  `feedback` TEXT NULL,
  `image_url` TEXT NULL,
  `rating` INT DEFAULT 5,
  `sort_order` INT DEFAULT 0
) ENGINE=InnoDB;

-- 11. Create the Milestones table
CREATE TABLE IF NOT EXISTS `milestones` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `number` VARCHAR(50) NOT NULL,
  `label` VARCHAR(255) NOT NULL,
  `icon_name` VARCHAR(100) DEFAULT 'CheckCircle',
  `sort_order` INT DEFAULT 0
) ENGINE=InnoDB;

-- 12. Create the Contact Messages table
CREATE TABLE IF NOT EXISTS `messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `company` VARCHAR(255) NULL,
  `service` VARCHAR(255) NULL,
  `message` TEXT NULL,
  `date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 13. Create the Candidate Applications table
CREATE TABLE IF NOT EXISTS `applications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `job_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NULL,
  `resume_url` TEXT NULL,
  `message` TEXT NULL,
  `date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- ==========================================
-- DEFAULT SEED DATA INSERTION
-- ==========================================

-- A. Default Administrator (password: admin123)
-- Hash generated using bcrypt with salt rounds = 10
INSERT IGNORE INTO `admin_users` (`id`, `username`, `password_hash`) VALUES 
(1, 'admin', '$2b$10$p8w0wf.SlGrfQv.lEy2jWuwdipNwY27oKggf5K7k1lnMpng5cvi.K');

-- B. Default Site Configuration
INSERT IGNORE INTO `settings` (
  `id`, `site_name`, `logo_url`, `favicon_url`, `primary_color`, `secondary_color`, 
  `meta_title`, `meta_description`, `meta_keywords`, 
  `facebook_url`, `instagram_url`, `linkedin_url`, `whatsapp_num`, `youtube_url`, `twitter_url`,
  `email`, `phone`, `hours`, `address`, `map_url`
) VALUES (
  1, 
  'Sawariya Solution', 
  '/logo.png', 
  '/favicon.ico', 
  '#004aad', 
  '#3b82f6',
  'Sawariya Solution | Enterprise Digital Consulting & Engineering',
  'Sawariya Solution is a premier digital consulting and technology services agency. We engineer high-performance systems, AI automation, and cloud solutions for global enterprises.',
  'sawariya, consulting, cloud infrastructure, AI automation, cybersecurity, custom software engineering',
  'https://facebook.com/sawariyasolution', 
  'https://instagram.com/sawariyasolution', 
  'https://linkedin.com/company/sawariyasolution', 
  '+918000551065', 
  'https://youtube.com', 
  'https://twitter.com',
  'solutions@sawariyasolution.com', 
  '+91 80005 51065', 
  'Mon - Sat: 9:00 AM - 7:00 PM IST',
  'Vadodara, Gujarat, India', 
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118147.68202029742!2d73.10304624795325!3d22.28502202636284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc8ab91a3ddab%3A0xac39d3b311572119!2sVadodara%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1687123984570!5m2!1sen!2sin'
);

-- C. Default Hero Configuration
INSERT IGNORE INTO `hero` (
  `id`, `subtitle`, `title`, `description`, `primary_cta_text`, `primary_cta_link`, `secondary_cta_text`, `secondary_cta_link`, `image_url`
) VALUES (
  1, 
  'Enterprise Digital Consulting', 
  'Engineering the Digital Future of Global Brands',
  'We deliver high-end technical consulting, bespoke enterprise solutions, and robust systems architecture that drive efficiency, scale, and long-term business growth.',
  'Book a Strategy Call', 
  '#contact', 
  'Explore Services', 
  '/services',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
);

-- D. Default Capabilities & Services
INSERT IGNORE INTO `services` (`id`, `title`, `description`, `icon_name`, `sort_order`) VALUES
(1, 'Cloud Infrastructure', 'AWS/GCP multi-cloud scaling, serverless deployment models, IaC pipeline automation utilizing Terraform, containerized deployments with Kubernetes, and CDN edge path optimization.', 'Cloud', 1),
(2, 'AI & Smart Automation', 'Custom LLM deployment pipelines incorporating LangChain, RAG configurations over vector indexes (Pinecone/Chroma), process automation scripts, and predictive metrics tracking.', 'Cpu', 2),
(3, 'Cybersecurity Systems', 'ISO 27001 alignment, Zero-Trust network setup (ZTNA), end-to-end payload encryption keys, automated firewall configuration audits, and OAuth2 security authorization setups.', 'Shield', 3),
(4, 'Custom Software Engineering', 'Fullstack web architectures using React/Node, highly responsive custom APIs built in Go/Rust, transactional ledgers, database replication setups, and fast page speeds.', 'Code', 4),
(5, 'Product Strategy', 'Detailed tech choice audits, capacity scalability modeling, UI/UX system mapping, structural logic audits, and concrete ROI/cost projections metrics.', 'TrendingUp', 5),
(6, 'Global Infrastructure', 'Edge server routing systems, database replication pools across geographic nodes, cloud storage optimizations, and global load balancers management.', 'Globe', 6);

-- E. Default Products Showcase
INSERT IGNORE INTO `products` (`id`, `tag`, `title`, `description`, `image_url`, `benefits_json`, `cta_text`, `cta_link`, `sort_order`) VALUES
(1, 'Platform', 'Sawariya Apex Control Panel', 'A unified digital control dashboard engineered for complex operations systems. It enables system administrators to manage live data streams, monitor load metrics, and deploy dynamic API keys across global microservices with sub-millisecond response latency.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', '["Dynamic server load monitoring & re-allocation","Military-grade single sign-on (SSO) integration","Advanced zero-latency visual query planner"]', 'Request Sandbox Access', '#contact', 1),
(2, 'Data Layer', 'Sawariya Synapse AI Sync', 'An automated message broker and sync network designed to keep databases across separate physical systems aligned in real time. It uses cognitive flow analysis to route payloads, resolve version conflicts, and optimize database read/write queries without server lockups.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', '["Automated schema synchronization and migration","Smart conflict resolution algorithms","End-to-end data encryption in transit & rest"]', 'View API Documentation', '#contact', 2);

-- F. Default Milestones
INSERT IGNORE INTO `milestones` (`id`, `number`, `label`, `icon_name`, `sort_order`) VALUES
(1, '480+', 'Completed Builds', 'CheckSquare', 1),
(2, '200+', 'Enterprise Clients', 'Briefcase', 2),
(3, '12+', 'Years of Experience', 'Award', 3),
(4, '85%', 'Client Growth %', 'TrendingUp', 4);

-- G. Default Testimonials
INSERT IGNORE INTO `testimonials` (`id`, `name`, `role`, `company`, `feedback`, `image_url`, `rating`, `sort_order`) VALUES
(1, 'Sarah Jenkins', 'VP of Product', 'Apex Systems', 'Sawariya Solution completely overhauled our server management strategy. We transitioned from expensive monolith databases to multi-region cloud clusters. Our payload speed increased by 40% while operating costs were slashed by almost half.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', 5, 1),
(2, 'Marcus Chen', 'Director of Architecture', 'Equinox Finance', 'As a financial technology developer, database compliance is our biggest hurdle. Yash and the Sawariya engineering team constructed a custom zero-knowledge data replication system that solved our auditing bottlenecks instantly.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', 5, 2),
(3, 'Alaina Vance', 'Founder', 'Spark Creative', 'Working with Sawariya was an amazing experience. They acted as a true strategic partner, not just code executors. Their consulting saved us months of development cycles during our cloud migration phase.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', 5, 3);

-- H. Default Blog Articles
INSERT IGNORE INTO `blogs` (`id`, `category`, `title`, `excerpt`, `content`, `image_url`, `author`, `date`) VALUES
(1, 'Cloud Scaling', 'Migrating Monolithic Databases to Serverless Graph Databases', 'Explore the exact strategies we used to transition a global logistics partner from an expensive oracle SQL core to serverless graph nodes.', 'Migrating databases can feel like open-heart surgery on your product. However, as scaling requirements increase, relational database limits become scaling bottlenecks. This article breaks down our transition of a large logistics system from SQL server instances to serverless graph databases, increasing transaction velocity by 300% and minimizing network roundtrips.', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80', 'Yashwardhan Sharma', '2026-06-12'),
(2, 'Automation', 'Securing Cognitive Pipelines in Automated Enterprise Workflows', 'How to deploy automated pipelines with zero vulnerability risks. Check out the basic validation layers required for systems integrity.', 'Cognitive automated pipelines present unique threat surfaces. In this post, we share our design framework for wrapping automation executors in sandboxed configurations, protecting internal storage databases and keys from prompt injections and unauthenticated payload inputs.', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80', 'Yashwardhan Sharma', '2026-05-28'),
(3, 'Cybersecurity', 'Designing Zero-Trust Access Systems for Remote Infrastructures', 'Zero-Trust is not just a marketing buzzword. It is a vital framework. Here is our architectural design breakdown for secure networks.', 'As corporate perimeters expand, perimeter-based firewall strategies fail. Zero-Trust Access (ZTA) ensures that every single network handshake is authenticated, authorized, and continuously validated. Learn how to configure ZTA configurations for remote DevOps architectures.', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80', 'Yashwardhan Sharma', '2026-05-15');

-- I. Default Careers
INSERT IGNORE INTO `careers` (`id`, `title`, `department`, `location`, `type`, `description`, `requirements_json`) VALUES
(1, 'Senior Cloud Architect', 'Engineering', 'Vadodara, India (Hybrid)', 'Full-Time', 'We are seeking a Senior Cloud Architect to design and implement multi-region Kubernetes clusters, Serverless application architectures, and infrastructure-as-code automation. You will lead client digital transformations and collaborate closely with our systems engineers.', '["7+ years experience in AWS/GCP architecture","Proficiency with Terraform, Docker, and Kubernetes","Strong understanding of Zero-Trust Security networks","Excellent client consulting and presentation skills"]'),
(2, 'Senior AI Systems Engineer', 'AI & Automation', 'Vadodara, India (Hybrid)', 'Full-Time', 'Join our smart automation team to deploy and orchestrate large language models (LLMs), build retrieval-augmented generation (RAG) pipelines, and integrate cognitive tools with legacy systems.', '["4+ years working with Python, LangChain, and vector databases","Experience fine-tuning models and deploying in production","Understanding of Node.js, Next.js, and API routing"]');

-- J. Default Portfolio Case Studies
INSERT IGNORE INTO `portfolio` (`id`, `category`, `title`, `client`, `description`, `image_url`, `link`, `sort_order`) VALUES
(1, 'Cloud Migration', 'Apex Global Logistics Sync', 'Apex Systems', 'Transitioned a monolithic logistical tracking framework to serverless microservices on AWS, saving 40% on operating costs and increasing read speeds by 3x.', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80', 'https://sawariyasolution.com', 1),
(2, 'FinTech Audit Platform', 'Zero-Knowledge Ledger Compliance', 'Equinox Finance', 'Designed a secure zero-knowledge proof ledger synchronization mechanism to audit compliance without leaking transaction detail records.', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80', 'https://sawariyasolution.com', 2);
