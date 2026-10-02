import { DigitalProduct, SiteSettings } from '../types/marketplace';

export const STARTER_PRODUCTS: DigitalProduct[] = [
  {
    product_id: 'P-GOYE-001',
    product_name: 'Business Plan Template Complete',
    category: 'Business Templates',
    short_description: 'Complete fill-in business plan for Nigeria + international market with financial projections model.',
    full_description: 'An exhaustive, executive-grade business plan template designed specifically for Nigerian and international operations. Includes market opportunity estimation (TAM/SAM/SOM), CAC/LTV calculations, competitive matrix, and complete 3-year cash flow forecasting tables ready for commercial loan and investor submissions.',
    version: '1.0',
    creator: 'GOYE Team',
    ownership_status: 'OWNED_BY_GOYE',
    rights_documentation_status: 'Verified',
    commercial_use_permission_status: 'Commercial Allowed',
    file_type: 'DOCX',
    file_size: '2.8 MB',
    price: 2500,
    currency: 'NGN',
    product_status: 'Active',
    publication_date: '2026-01-10',
    last_updated: '2026-03-25',
    download_count: 0,
    sales_count: 0,
    file_path_private: '/private/products/01_goye_business_plan_template_complete.docx',
    preview_image: '/src/assets/images/goye_business_plan_1790804188811.jpg',
    license_terms: 'Single buyer license, commercial use allowed, no redistribution/resale of file itself',
    usage_instructions: 'Download, open in Microsoft Word or Google Docs, customize bracketed sections for your business, and export to PDF.',
    refund_policy_ref: 'Digital product, no refund after download, defective file replacement within 7 days',
    features: [
      '30-page fill-in-the-blanks corporate business plan',
      'Executive summary blueprint for banks and venture investors',
      '3-year financial model with cash flow and breakeven calculators',
      'Nigerian regulatory compliance roadmap (CAC, TIN, FIRS)'
    ],
    intended_audience: 'Entrepreneurs, startup founders, SME directors, and business consultants.',
    content_document_text: `GOYE BUSINESS PLAN TEMPLATE COMPLETE
Version 1.0 | © 2026 GOYE. All Rights Reserved.
Creator: GOYE Team

TABLE OF CONTENTS:
1. Executive Summary & Investment Thesis
2. Company Description & Legal Ownership (CAC/Corporate)
3. Products & Services Architecture
4. Market Analysis (Nigerian & Global TAM/SAM/SOM)
5. Marketing & Inbound Sales Pipeline
6. Operational Logistics & Infrastructure
7. Financial Plan: 36-Month Pro-Forma Cash Flow & Sensitivity Analysis

EXECUTIVE SUMMARY GUIDELINES:
- Problem: Define the exact friction your business solves.
- Solution: Quantifiable commercial value proposition.
- Revenue Model: Pricing structure in NGN (settled via Paystack/Flutterwave).`
  },
  {
    product_id: 'P-GOYE-002',
    product_name: 'Company Profile Template',
    category: 'Business Templates',
    short_description: 'Professional company profile layout for corporate bids, client pitches, and procurement registrations.',
    full_description: 'A modern, high-trust corporate company profile template formatted for professional presentation. Features sections for vision, core leadership, client case studies, track record, service catalog, and contact details.',
    version: '1.0',
    creator: 'GOYE Team',
    ownership_status: 'OWNED_BY_GOYE',
    rights_documentation_status: 'Verified',
    commercial_use_permission_status: 'Commercial Allowed',
    file_type: 'DOCX',
    file_size: '2.1 MB',
    price: 2000,
    currency: 'NGN',
    product_status: 'Active',
    publication_date: '2026-01-12',
    last_updated: '2026-03-20',
    download_count: 0,
    sales_count: 0,
    file_path_private: '/private/products/02_goye_company_profile_template.docx',
    preview_image: '/src/assets/images/goye_startup_kit_1790804175475.jpg',
    license_terms: 'Single buyer license, commercial use allowed, no redistribution/resale of file itself',
    usage_instructions: 'Download, open in compatible app, customize for your business',
    refund_policy_ref: 'Digital product, no refund after download, defective file replacement within 7 days',
    features: [
      'Structured 12-page executive layout',
      'Corporate governance and leadership team showcases',
      'Client testimonial and project gallery sections',
      'Procurement-ready compliance and certification layout'
    ],
    intended_audience: 'B2B service providers, agencies, engineering firms, and consultancies.',
    content_document_text: `GOYE COMPANY PROFILE TEMPLATE
Version 1.0 | © 2026 GOYE. All Rights Reserved.
Creator: GOYE Team

1. Corporate Profile & Purpose
2. Vision, Mission & Core Values
3. Core Service Capabilities
4. Leadership Team & Key Advisors
5. Selected Client Projects & Verified Outcomes
6. Corporate Compliance & Banking Mandates`
  },
  {
    product_id: 'P-GOYE-003',
    product_name: 'Invoice Template Pro',
    category: 'Business Templates',
    short_description: 'Excel invoice with auto-calc, Paystack ready, formatted for Nigerian businesses.',
    full_description: 'Automated Excel accounting invoice with embedded formulas for VAT (7.5% Nigerian standard), withholding tax deductions, itemized discounts, and banking remittance instructions. Ready for Paystack and Flutterwave bank transfer payments.',
    version: '1.0',
    creator: 'GOYE Team',
    ownership_status: 'OWNED_BY_GOYE',
    rights_documentation_status: 'Verified',
    commercial_use_permission_status: 'Commercial Allowed',
    file_type: 'XLSX',
    file_size: '1.2 MB',
    price: 1500,
    currency: 'NGN',
    product_status: 'Active',
    publication_date: '2026-01-15',
    last_updated: '2026-03-21',
    download_count: 0,
    sales_count: 0,
    file_path_private: '/private/products/03_goye_invoice_template_pro.xlsx',
    preview_image: '/src/assets/images/goye_business_plan_1790804188811.jpg',
    license_terms: 'Single buyer license, commercial use allowed, no redistribution/resale of file itself',
    usage_instructions: 'Download, open in Microsoft Excel or Google Sheets, input your rates, and export to PDF.',
    refund_policy_ref: 'Digital product, no refund after download, defective file replacement within 7 days',
    features: [
      'Automated Excel formulas for subtotal, VAT (7.5%), and net due',
      'Paystack and bank transfer remittance instructions section',
      'Milestone billing breakdown format',
      'Statutory late payment policy clauses'
    ],
    intended_audience: 'Freelancers, consultants, suppliers, and retail businesses.',
    content_document_text: `GOYE INVOICE TEMPLATE PRO
Version 1.0 | © 2026 GOYE. All Rights Reserved.
Creator: GOYE Team

- Includes automated calculation columns: Item, Qty, Unit Rate (NGN), Subtotal, VAT (7.5%), Balance Due.
- Banking Coordinates: Bank Name, Account Name, Account Number, Paystack reference note.`
  },
  {
    product_id: 'P-GOYE-004',
    product_name: 'Quotation Template',
    category: 'Business Templates',
    short_description: 'Quotation with validity period, scope breakdown, and client sign-off acceptance.',
    full_description: 'Professional commercial quotation template engineered to accelerate RFQ conversions. Includes itemized deliverable pricing, milestone breakdown, validity clauses, and a legal acceptance sign-off block.',
    version: '1.0',
    creator: 'GOYE Team',
    ownership_status: 'OWNED_BY_GOYE',
    rights_documentation_status: 'Verified',
    commercial_use_permission_status: 'Commercial Allowed',
    file_type: 'XLSX',
    file_size: '1.1 MB',
    price: 1500,
    currency: 'NGN',
    product_status: 'Active',
    publication_date: '2026-01-18',
    last_updated: '2026-03-22',
    download_count: 0,
    sales_count: 0,
    file_path_private: '/private/products/04_goye_quotation_template.xlsx',
    preview_image: '/src/assets/images/goye_business_plan_1790804188811.jpg',
    license_terms: 'Single buyer license, commercial use allowed, no redistribution/resale of file itself',
    usage_instructions: 'Download, open in compatible app, customize for your business',
    refund_policy_ref: 'Digital product, no refund after download, defective file replacement within 7 days',
    features: [
      'Automated pricing table in NGN',
      '14-day and 30-day quotation validity terms',
      'Terms of engagement & payment milestone structure',
      'Client acceptance signature block'
    ],
    intended_audience: 'Service vendors, contractors, and agencies.',
    content_document_text: `GOYE COMMERCIAL QUOTATION TEMPLATE
Version 1.0 | © 2026 GOYE. All Rights Reserved.
Creator: GOYE Team

Features line items, deliverable schedule, discount tiers, validity period, and commercial acceptance protocol.`
  },
  {
    product_id: 'P-GOYE-005',
    product_name: 'Business Proposal Template',
    category: 'Business Templates',
    short_description: 'Winning proposal framework with diagnostic problem-solving structure for corporate deals.',
    full_description: 'A proven B2B proposal template designed to win competitive contracts. Features problem diagnosis, scope boundary management to prevent scope creep, deliverable Gantt timeline, and milestone payment schedules in NGN.',
    version: '1.0',
    creator: 'GOYE Team',
    ownership_status: 'OWNED_BY_GOYE',
    rights_documentation_status: 'Verified',
    commercial_use_permission_status: 'Commercial Allowed',
    file_type: 'DOCX',
    file_size: '2.4 MB',
    price: 3000,
    currency: 'NGN',
    product_status: 'Active',
    publication_date: '2026-01-20',
    last_updated: '2026-03-22',
    download_count: 0,
    sales_count: 0,
    file_path_private: '/private/products/05_goye_business_proposal_template.docx',
    preview_image: '/src/assets/images/goye_startup_kit_1790804175475.jpg',
    license_terms: 'Single buyer license, commercial use allowed, no redistribution/resale of file itself',
    usage_instructions: 'Download, open in compatible app, customize for your business',
    refund_policy_ref: 'Digital product, no refund after download, defective file replacement within 7 days',
    features: [
      'High-conversion diagnostic problem-statement format',
      'Defensive scope-of-work boundaries',
      'Milestone investment schedule (50% mobilization, 30% delivery, 20% handover)',
      'Legal acceptance protocol'
    ],
    intended_audience: 'Digital agencies, consultancies, engineering services, and business developers.',
    content_document_text: `GOYE BUSINESS PROPOSAL TEMPLATE
Version 1.0 | © 2026 GOYE. All Rights Reserved.
Creator: GOYE Team

1. Strategic Context & Client Need
2. Proposed Solution Architecture
3. Scope of Work & Deliverables
4. Investment Schedule & Payment Milestones in NGN
5. Terms & Sign-off Acceptance`
  },
  {
    product_id: 'P-GOYE-006',
    product_name: 'Social Media Content Calendar 2026',
    category: 'Marketing Templates',
    short_description: '60-day calendar, multi-platform publishing matrix for LinkedIn, X/Twitter, Instagram & WhatsApp.',
    full_description: 'A 60-day multi-platform social media calendar spreadsheet designed to maintain consistent audience engagement and inbound lead generation. Structured around 4 core content pillars: Authority, Education, Proof, and Conversion.',
    version: '1.0',
    creator: 'GOYE Team',
    ownership_status: 'OWNED_BY_GOYE',
    rights_documentation_status: 'Verified',
    commercial_use_permission_status: 'Commercial Allowed',
    file_type: 'XLSX',
    file_size: '3.1 MB',
    price: 3500,
    currency: 'NGN',
    product_status: 'Active',
    publication_date: '2026-01-25',
    last_updated: '2026-03-24',
    download_count: 0,
    sales_count: 0,
    file_path_private: '/private/products/06_goye_social_media_content_calendar_2026.xlsx',
    preview_image: '/src/assets/images/goye_marketing_planner_1790804210634.jpg',
    license_terms: 'Single buyer license, commercial use allowed, no redistribution/resale of file itself',
    usage_instructions: 'Download, open in compatible app, customize for your business',
    refund_policy_ref: 'Digital product, no refund after download, defective file replacement within 7 days',
    features: [
      '60 pre-structured daily posting slots',
      '4-Pillar content strategy (Authority, Proof, Education, Offers)',
      'Hook formula library embedded directly in sheet',
      'Engagement and conversion metric tracking dashboard'
    ],
    intended_audience: 'Social media managers, creators, founders, and digital marketers.',
    content_document_text: `GOYE SOCIAL MEDIA CONTENT CALENDAR 2026
Version 1.0 | © 2026 GOYE. All Rights Reserved.
Creator: GOYE Team

- Includes 60 pre-formatted posting dates across LinkedIn, X/Twitter, Instagram, WhatsApp Status.
- Pillar tracking: 40% Authority, 30% Education, 20% Proof, 10% Direct Sales Offer.`
  },
  {
    product_id: 'P-GOYE-007',
    product_name: 'Marketing Planner 2026',
    category: 'Marketing Templates',
    short_description: 'Quarterly marketing planner with budget allocations, campaign sprints, and lead targets.',
    full_description: 'An actionable quarterly marketing planner for setting quarterly revenue targets, campaign sprints, lead generation channels, and customer acquisition budgets. Includes a weekly campaign execution calendar and ROI scorecard.',
    version: '1.0',
    creator: 'GOYE Team',
    ownership_status: 'OWNED_BY_GOYE',
    rights_documentation_status: 'Verified',
    commercial_use_permission_status: 'Commercial Allowed',
    file_type: 'PDF',
    file_size: '2.5 MB',
    price: 3000,
    currency: 'NGN',
    product_status: 'Active',
    publication_date: '2026-01-28',
    last_updated: '2026-03-22',
    download_count: 0,
    sales_count: 0,
    file_path_private: '/private/products/07_goye_marketing_planner_2026.pdf',
    preview_image: '/src/assets/images/goye_marketing_planner_1790804210634.jpg',
    license_terms: 'Single buyer license, commercial use allowed, no redistribution/resale of file itself',
    usage_instructions: 'Download, open in compatible app, customize for your business',
    refund_policy_ref: 'Digital product, no refund after download, defective file replacement within 7 days',
    features: [
      'Quarter-by-quarter revenue goal setting framework',
      'Lead generation channel ROI calculator',
      'Weekly marketing sprint checklists',
      'Customer acquisition cost (CAC) benchmarking tools'
    ],
    intended_audience: 'Marketing leads, small business operators, and consultants.',
    content_document_text: `GOYE MARKETING PLANNER 2026
Version 1.0 | © 2026 GOYE. All Rights Reserved.
Creator: GOYE Team

Quarterly Campaign Cadence:
Q1: Foundation, Positioning & Audience Acquisition
Q2: Multi-Channel Expansion & Lead Generation
Q3: Conversion Optimization & Retargeting
Q4: High-Yield Year-End Campaign Execution`
  },
  {
    product_id: 'P-GOYE-008',
    product_name: 'AI Business Prompt Pack - 100 Original',
    category: 'AI Resources',
    short_description: '100 original AI prompts for business (customer service, marketing, sales Nigeria).',
    full_description: 'A master prompt engineering collection of 100 parameter-driven, tested AI prompts tailored for business execution in Nigeria and globally. Covers customer service de-escalation, high-converting sales outreach, WhatsApp follow-ups, market research, and operational SOP generation.',
    version: '1.0',
    creator: 'GOYE Team',
    ownership_status: 'OWNED_BY_GOYE',
    rights_documentation_status: 'Verified',
    commercial_use_permission_status: 'Commercial Allowed',
    file_type: 'PDF',
    file_size: '3.2 MB',
    price: 5000,
    currency: 'NGN',
    product_status: 'Active',
    publication_date: '2026-02-01',
    last_updated: '2026-03-26',
    download_count: 0,
    sales_count: 0,
    file_path_private: '/private/products/08_goye_ai_business_prompt_pack_100_original.pdf',
    preview_image: '/src/assets/images/goye_ai_prompts_1790804200108.jpg',
    license_terms: 'Single buyer license, commercial use allowed, no redistribution/resale of file itself',
    usage_instructions: 'Download, open in compatible app, customize for your business',
    refund_policy_ref: 'Digital product, no refund after download, defective file replacement within 7 days',
    features: [
      '100 tested prompt recipes with bracketed variable tags',
      'Customer service scripts for payment disputes and delays',
      'Cold email and WhatsApp commercial follow-up sequences',
      'Standard operating procedure (SOP) authoring prompts'
    ],
    intended_audience: 'Entrepreneurs, operations leads, sales teams, and agency owners.',
    content_document_text: `GOYE AI BUSINESS PROMPT PACK - 100 ORIGINAL
Version 1.0 | © 2026 GOYE. All Rights Reserved.
Creator: GOYE Team

SECTION 1: CUSTOMER SERVICE SCRIPTS (PROMPTS 1-25)
SECTION 2: B2B SALES & OUTREACH (PROMPTS 26-50)
SECTION 3: CONTENT MARKETING & AD COPY (PROMPTS 51-75)
SECTION 4: OPERATIONAL SOPS & FINANCIAL AUDITS (PROMPTS 76-100)`
  },
  {
    product_id: 'P-GOYE-009',
    product_name: 'Study Planner & Goal Setting',
    category: 'Education Resources',
    short_description: 'Study planner + SMART goals system with daily revision tracking and exam preparation.',
    full_description: 'A structured educational study planner designed for students, professional certification candidates (ICAN, ACCA, PMP, AWS), and lifelong learners. Combines SMART goal setting with daily revision blocks and progress scorecards.',
    version: '1.0',
    creator: 'GOYE Team',
    ownership_status: 'OWNED_BY_GOYE',
    rights_documentation_status: 'Verified',
    commercial_use_permission_status: 'Commercial Allowed',
    file_type: 'PDF',
    file_size: '1.8 MB',
    price: 1500,
    currency: 'NGN',
    product_status: 'Active',
    publication_date: '2026-02-05',
    last_updated: '2026-03-20',
    download_count: 0,
    sales_count: 0,
    file_path_private: '/private/products/09_goye_study_planner_and_goal_setting.pdf',
    preview_image: '/src/assets/images/goye_startup_kit_1790804175475.jpg',
    license_terms: 'Single buyer license, commercial use allowed, no redistribution/resale of file itself',
    usage_instructions: 'Download, open in compatible app, customize for your business',
    refund_policy_ref: 'Digital product, no refund after download, defective file replacement within 7 days',
    features: [
      'SMART goal worksheet with milestone deadlines',
      'Daily 2-hour Pomodoro revision blocks',
      'Exam readiness tracker and syllabus coverage matrix',
      'Habit tracking and focus audit checklists'
    ],
    intended_audience: 'Students, exam candidates, researchers, and professional certification takers.',
    content_document_text: `GOYE STUDY PLANNER & GOAL SETTING
Version 1.0 | © 2026 GOYE. All Rights Reserved.
Creator: GOYE Team

1. SMART Goal Architecture: Specific, Measurable, Achievable, Relevant, Time-Bound.
2. 12-Week Syllabus Pacing Matrix.
3. Daily Active Recall & Spaced Repetition Tracker.`
  },
  {
    product_id: 'P-GOYE-010',
    product_name: 'Website Content Templates & Launch Checklist',
    category: 'Website Resources',
    short_description: 'Website copy + 45-point launch checklist (Paystack/Flutterwave ready).',
    full_description: 'A complete website launch package for businesses building modern websites. Includes pre-written high-converting copy wireframes for Homepage, About Us, Services, FAQ, and Checkout, paired with a 45-point pre-flight technical checklist covering DNS, SSL, mobile responsiveness, and Paystack/Flutterwave integration.',
    version: '1.0',
    creator: 'GOYE Team',
    ownership_status: 'OWNED_BY_GOYE',
    rights_documentation_status: 'Verified',
    commercial_use_permission_status: 'Commercial Allowed',
    file_type: 'DOCX',
    file_size: '2.6 MB',
    price: 4000,
    currency: 'NGN',
    product_status: 'Active',
    publication_date: '2026-02-08',
    last_updated: '2026-03-24',
    download_count: 0,
    sales_count: 0,
    file_path_private: '/private/products/10_goye_website_content_templates_and_launch_checklist.docx',
    preview_image: '/src/assets/images/goye_startup_kit_1790804175475.jpg',
    license_terms: 'Single buyer license, commercial use allowed, no redistribution/resale of file itself',
    usage_instructions: 'Download, open in compatible app, customize for your business',
    refund_policy_ref: 'Digital product, no refund after download, defective file replacement within 7 days',
    features: [
      'Full website copy framework for Homepage, About, Services & Contact',
      '45-point pre-launch technical, design & security audit',
      'Paystack & Flutterwave webhook and checkout integration checks',
      'SEO meta titles, descriptions, and OpenGraph tags checklist'
    ],
    intended_audience: 'Web designers, developers, business owners, and agency managers.',
    content_document_text: `GOYE WEBSITE CONTENT TEMPLATES & LAUNCH CHECKLIST
Version 1.0 | © 2026 GOYE. All Rights Reserved.
Creator: GOYE Team

- Website Copy Templates: Hero headline formulas, Value Proposition, Feature matrix, Testimonial blocks.
- 45-Point Launch Protocol: DNS TTL, SSL certificates, Mobile responsiveness, Paystack/Flutterwave gateway keys verification.`
  },
  {
    product_id: 'P-GOYE-011',
    product_name: 'Productivity Daily Weekly Project Planner',
    category: 'Productivity Templates',
    short_description: 'All-in-one productivity system for daily time-blocking, weekly reviews, and milestone projects.',
    full_description: 'A minimalist, scientifically backed productivity planning system. Formatted for high achievers who need to manage multiple corporate and creative projects without burnout. Features priority matrices (Eisenhower), time-blocking templates, and weekly review debriefs.',
    version: '1.0',
    creator: 'GOYE Team',
    ownership_status: 'OWNED_BY_GOYE',
    rights_documentation_status: 'Verified',
    commercial_use_permission_status: 'Commercial Allowed',
    file_type: 'PDF',
    file_size: '2.0 MB',
    price: 2000,
    currency: 'NGN',
    product_status: 'Active',
    publication_date: '2026-02-12',
    last_updated: '2026-03-21',
    download_count: 0,
    sales_count: 0,
    file_path_private: '/private/products/11_goye_productivity_daily_weekly_project_planner.pdf',
    preview_image: '/src/assets/images/goye_marketing_planner_1790804210634.jpg',
    license_terms: 'Single buyer license, commercial use allowed, no redistribution/resale of file itself',
    usage_instructions: 'Download, open in compatible app, customize for your business',
    refund_policy_ref: 'Digital product, no refund after download, defective file replacement within 7 days',
    features: [
      'Daily time-blocking schedule (6:00 AM - 9:00 PM)',
      'Top 3 non-negotiable daily objectives filter',
      'Weekly retrospective: Wins, bottlenecks & adjustments',
      'Project milestone Gantt worksheet'
    ],
    intended_audience: 'Founders, project managers, freelancers, and corporate professionals.',
    content_document_text: `GOYE PRODUCTIVITY DAILY WEEKLY PROJECT PLANNER
Version 1.0 | © 2026 GOYE. All Rights Reserved.
Creator: GOYE Team

Daily Planning Framework:
1. One Core Priority (The Big Rock)
2. Two Secondary Tasks
3. Three Quick Administrative Wins
4. End-of-Day Calibration`
  },
  {
    product_id: 'P-GOYE-012',
    product_name: 'Client Management & Onboarding Pack',
    category: 'Small Business Tools',
    short_description: 'Excel tracker + onboarding form to streamline client intake and project kickoff.',
    full_description: 'A complete client management system designed to eliminate client friction. Includes a master Excel client tracker with project statuses, invoice tracking, and a professional Client Onboarding Intake Questionnaire (DOCX) that captures project requirements upfront.',
    version: '1.0',
    creator: 'GOYE Team',
    ownership_status: 'OWNED_BY_GOYE',
    rights_documentation_status: 'Verified',
    commercial_use_permission_status: 'Commercial Allowed',
    file_type: 'XLSX/DOCX',
    file_size: '3.0 MB',
    price: 3500,
    currency: 'NGN',
    product_status: 'Active',
    publication_date: '2026-02-15',
    last_updated: '2026-03-23',
    download_count: 0,
    sales_count: 0,
    file_path_private: '/private/products/12_goye_client_management_and_onboarding_pack.zip',
    preview_image: '/src/assets/images/goye_startup_kit_1790804175475.jpg',
    license_terms: 'Single buyer license, commercial use allowed, no redistribution/resale of file itself',
    usage_instructions: 'Download, open in compatible app, customize for your business',
    refund_policy_ref: 'Digital product, no refund after download, defective file replacement within 7 days',
    features: [
      'Master client database spreadsheet with pipeline statuses',
      'Comprehensive client onboarding questionnaire (DOCX)',
      'Project kickoff checklist & asset gathering guide',
      'Invoice payment status and balance-due tracker'
    ],
    intended_audience: 'Agencies, consultants, designers, developers, and professional service providers.',
    content_document_text: `GOYE CLIENT MANAGEMENT & ONBOARDING PACK
Version 1.0 | © 2026 GOYE. All Rights Reserved.
Creator: GOYE Team

- Client Intake Questionnaire: Strategic objectives, technical scope, brand assets, timeline.
- Master Client Tracker: Client ID, Contact Name, Project Stage, Billed (NGN), Paid (NGN), Outstanding Balance.`
  },
  {
    product_id: 'P-GOYE-013',
    product_name: 'Small Business Startup Guide Nigeria E-book',
    category: 'E-books and Guides',
    short_description: '32-page guide for Nigerian entrepreneurs covering registration, banking, tax, and sales.',
    full_description: 'An authoritative 32-page practical handbook for establishing and operating a profitable commercial business in Nigeria. Covers Corporate Affairs Commission (CAC) registration steps, corporate tax (TIN/FIRS) compliance, corporate bank account mandates, Paystack/Flutterwave setup, and customer acquisition strategies in the Nigerian market.',
    version: '1.0',
    creator: 'GOYE Team',
    ownership_status: 'OWNED_BY_GOYE',
    rights_documentation_status: 'Verified',
    commercial_use_permission_status: 'Commercial Allowed',
    file_type: 'PDF',
    file_size: '4.2 MB',
    price: 4500,
    currency: 'NGN',
    product_status: 'Active',
    publication_date: '2026-02-18',
    last_updated: '2026-03-24',
    download_count: 0,
    sales_count: 0,
    file_path_private: '/private/products/13_goye_small_business_startup_guide_nigeria_ebook.pdf',
    preview_image: '/src/assets/images/goye_startup_kit_1790804175475.jpg',
    license_terms: 'Single buyer license, commercial use allowed, no redistribution/resale of file itself',
    usage_instructions: 'Download, open in compatible app, customize for your business',
    refund_policy_ref: 'Digital product, no refund after download, defective file replacement within 7 days',
    features: [
      '32 comprehensive chapters focused on the Nigerian business environment',
      'CAC registration walkthrough (Business Name vs Ltd)',
      'Corporate bank account setup & SCUML guidelines',
      'Accepting digital payments (Paystack & Flutterwave) compliant protocols'
    ],
    intended_audience: 'Aspiring and active entrepreneurs operating in or expanding into Nigeria.',
    content_document_text: `GOYE SMALL BUSINESS STARTUP GUIDE NIGERIA
Version 1.0 | © 2026 GOYE. All Rights Reserved.
Creator: GOYE Team

Chapter 1: Legal Entity Formation (CAC Guidelines)
Chapter 2: Tax Registration & Compliance (FIRS & State Boards)
Chapter 3: Corporate Banking & Dual Mandates
Chapter 4: Digital Payment Infrastructure (Paystack & Flutterwave)
Chapter 5: Distribution & Sales Channels in Nigeria`
  },
  {
    product_id: 'P-GOYE-014',
    product_name: 'AI Workflow Guide for Business',
    category: 'AI Resources',
    short_description: 'AI SOPs and workflows to automate customer inquiries, document summarization, and sales.',
    full_description: 'A tactical handbook demonstrating how small businesses can integrate artificial intelligence into daily operations. Contains step-by-step SOPs for automated email triage, customer support response drafting, proposal drafting, and market research synthesis.',
    version: '1.0',
    creator: 'GOYE Team',
    ownership_status: 'OWNED_BY_GOYE',
    rights_documentation_status: 'Verified',
    commercial_use_permission_status: 'Commercial Allowed',
    file_type: 'PDF',
    file_size: '3.4 MB',
    price: 4000,
    currency: 'NGN',
    product_status: 'Active',
    publication_date: '2026-02-20',
    last_updated: '2026-03-25',
    download_count: 0,
    sales_count: 0,
    file_path_private: '/private/products/14_goye_ai_workflow_guide_for_business.pdf',
    preview_image: '/src/assets/images/goye_ai_prompts_1790804200108.jpg',
    license_terms: 'Single buyer license, commercial use allowed, no redistribution/resale of file itself',
    usage_instructions: 'Download, open in compatible app, customize for your business',
    refund_policy_ref: 'Digital product, no refund after download, defective file replacement within 7 days',
    features: [
      '5 core operational business workflows with AI integration',
      'Standard operating procedure (SOP) documentation templates',
      'Zero-hallucination verification guidelines',
      'Data privacy and corporate confidential data protection rules'
    ],
    intended_audience: 'Operations managers, business owners, and tech-forward teams.',
    content_document_text: `GOYE AI WORKFLOW GUIDE FOR BUSINESS
Version 1.0 | © 2026 GOYE. All Rights Reserved.
Creator: GOYE Team

Workflow 1: Incoming Customer Inquiry Automated Classification & Routing
Workflow 2: Fast Executive Proposal Drafting from Call Notes
Workflow 3: Competitive Intelligence Synthesis & Industry Trend Teardowns`
  },
  {
    product_id: 'P-GOYE-015',
    product_name: 'Professional Documents Pack',
    category: 'Professional Documents',
    short_description: 'NDA, Offer Letter, Service Agreement essential legal contracts for operating safely.',
    full_description: 'A corporate legal documentation suite designed for Nigerian and international transactions. Includes a Non-Disclosure Agreement (NDA), Employment Offer Letter, Independent Contractor Service Agreement, and Master Services Agreement (MSA) with clear payment terms and limitation of liability clauses.',
    version: '1.0',
    creator: 'GOYE Team',
    ownership_status: 'OWNED_BY_GOYE',
    rights_documentation_status: 'Verified',
    commercial_use_permission_status: 'Commercial Allowed',
    file_type: 'ZIP',
    file_size: '3.6 MB',
    price: 5000,
    currency: 'NGN',
    product_status: 'Active',
    publication_date: '2026-02-24',
    last_updated: '2026-03-24',
    download_count: 0,
    sales_count: 0,
    file_path_private: '/private/products/15_goye_professional_documents_pack.zip',
    preview_image: '/src/assets/images/goye_startup_kit_1790804175475.jpg',
    license_terms: 'Single buyer license, commercial use allowed, no redistribution/resale of file itself',
    usage_instructions: 'Download, open in compatible app, customize for your business',
    refund_policy_ref: 'Digital product, no refund after download, defective file replacement within 7 days',
    features: [
      'Mutual Non-Disclosure Agreement (NDA)',
      'Independent Contractor / Freelancer Agreement',
      'Standard Employee Offer Letter with confidentiality covenants',
      'Master Services Agreement (MSA) with intellectual property assignment'
    ],
    intended_audience: 'Founders, HR managers, consultants, and enterprise operators.',
    content_document_text: `GOYE PROFESSIONAL DOCUMENTS PACK
Version 1.0 | © 2026 GOYE. All Rights Reserved.
Creator: GOYE Team

INCLUDED CONTRACT TEMPLATES:
1. Mutual Non-Disclosure Agreement (NDA)
2. Master Services Agreement (MSA)
3. Formal Employment Offer Letter with IP assignment clauses
4. Contractor Statement of Work (SOW)`
  },
  {
    product_id: 'P-GOYE-016',
    product_name: 'Resume & Cover Letter Pack - ATS Friendly',
    category: 'Professional Documents',
    short_description: 'ATS-friendly resume, cover letter, LinkedIn guide - Global #1 seller.',
    full_description: 'A precision-engineered career acceleration package designed to bypass automated Applicant Tracking Systems (ATS). Includes 3 ATS-tested resume templates, 2 persuasive cover letter models, and an action-verb phrase book for tech, finance, and executive roles.',
    version: '1.0',
    creator: 'GOYE Team',
    ownership_status: 'OWNED_BY_GOYE',
    rights_documentation_status: 'Verified',
    commercial_use_permission_status: 'Commercial Allowed',
    file_type: 'DOCX',
    file_size: '2.2 MB',
    price: 3000,
    currency: 'NGN',
    product_status: 'Active',
    publication_date: '2026-02-28',
    last_updated: '2026-03-26',
    download_count: 0,
    sales_count: 0,
    file_path_private: '/private/products/16_goye_resume_and_cover_letter_pack_ats_friendly.docx',
    preview_image: '/src/assets/images/goye_business_plan_1790804188811.jpg',
    license_terms: 'Single buyer license, commercial use allowed, no redistribution/resale of file itself',
    usage_instructions: 'Download, open in compatible app, customize for your business',
    refund_policy_ref: 'Digital product, no refund after download, defective file replacement within 7 days',
    features: [
      '3 ATS-optimized resume layouts with zero column parsing bugs',
      'High-impact cover letter framework tailored for hiring managers',
      '100+ quantifiable impact action verbs',
      'LinkedIn headline & summary optimization blueprint'
    ],
    intended_audience: 'Job seekers, remote workers, executives, and career switchers.',
    content_document_text: `GOYE RESUME & COVER LETTER PACK - ATS FRIENDLY
Version 1.0 | © 2026 GOYE. All Rights Reserved.
Creator: GOYE Team

ATS Formatting Rules:
- Single-column linear layout
- Standard font hierarchy (Calibri, Arial, Georgia)
- Explicit Skill Keywords matching Job Descriptions
- Metric-Driven Bullet Points: [Action Verb] + [Context] + [Result in % or NGN/$]`
  },
  {
    product_id: 'P-GOYE-017',
    product_name: 'Social Media Content Pack - 30 Viral Posts',
    category: 'Social Media Content Packs',
    short_description: '30 viral caption templates + 100 hooks + hashtags Nigeria+Global.',
    full_description: 'A plug-and-play social media publishing arsenal. Includes 30 fill-in-the-blank caption formulas proven to drive saves, shares, and comments, alongside a library of 100 scroll-stopping hooks and curated hashtag groupings for Nigerian and international business accounts.',
    version: '1.0',
    creator: 'GOYE Team',
    ownership_status: 'OWNED_BY_GOYE',
    rights_documentation_status: 'Verified',
    commercial_use_permission_status: 'Commercial Allowed',
    file_type: 'PDF',
    file_size: '2.9 MB',
    price: 6000,
    currency: 'NGN',
    product_status: 'Active',
    publication_date: '2026-03-02',
    last_updated: '2026-03-25',
    download_count: 0,
    sales_count: 0,
    file_path_private: '/private/products/17_goye_social_media_content_pack_30_viral_posts.pdf',
    preview_image: '/src/assets/images/goye_marketing_planner_1790804210634.jpg',
    license_terms: 'Single buyer license, commercial use allowed, no redistribution/resale of file itself',
    usage_instructions: 'Download, open in compatible app, customize for your business',
    refund_policy_ref: 'Digital product, no refund after download, defective file replacement within 7 days',
    features: [
      '30 full caption templates with call-to-action endings',
      '100 tested hook formulas for LinkedIn, X/Twitter, and Instagram',
      'Curated business and entrepreneur hashtag clusters',
      'Visual asset idea checklist for carousel slides'
    ],
    intended_audience: 'Founders, content creators, influencers, and brand managers.',
    content_document_text: `GOYE SOCIAL MEDIA CONTENT PACK - 30 VIRAL POSTS
Version 1.0 | © 2026 GOYE. All Rights Reserved.
Creator: GOYE Team

Post Template #1: The Unpopular Industry Truth
Post Template #2: How We Achieved [Result] in [Timeframe]
Post Template #3: 5 Common Mistakes That Cost Small Businesses Millions
Post Template #4: The Behind-the-Scenes Customer Breakdown`
  },
  {
    product_id: 'P-GOYE-018',
    product_name: 'Small Business Finance Tracker',
    category: 'Small Business Tools',
    short_description: 'Income expense tracker with dashboard P&L and cash runway calculations.',
    full_description: 'A streamlined financial bookkeeping spreadsheet built for Nigerian SMEs. Automatically calculates Monthly Income, Cost of Goods Sold (COGS), Operating Overhead, Net Profit, and Cash Runway in NGN. Requires no advanced accounting knowledge.',
    version: '1.0',
    creator: 'GOYE Team',
    ownership_status: 'OWNED_BY_GOYE',
    rights_documentation_status: 'Verified',
    commercial_use_permission_status: 'Commercial Allowed',
    file_type: 'XLSX',
    file_size: '2.3 MB',
    price: 4000,
    currency: 'NGN',
    product_status: 'Active',
    publication_date: '2026-03-05',
    last_updated: '2026-03-25',
    download_count: 0,
    sales_count: 0,
    file_path_private: '/private/products/18_goye_small_business_finance_tracker.xlsx',
    preview_image: '/src/assets/images/goye_business_plan_1790804188811.jpg',
    license_terms: 'Single buyer license, commercial use allowed, no redistribution/resale of file itself',
    usage_instructions: 'Download, open in compatible app, customize for your business',
    refund_policy_ref: 'Digital product, no refund after download, defective file replacement within 7 days',
    features: [
      'Automated P&L visual dashboard',
      'Income & expense categorization by department',
      'Cash runway calculator (in months)',
      'Tax reserve deduction calculation (FIRS/State)'
    ],
    intended_audience: 'Small business owners, sole proprietors, retail stores, and online sellers.',
    content_document_text: `GOYE SMALL BUSINESS FINANCE TRACKER
Version 1.0 | © 2026 GOYE. All Rights Reserved.
Creator: GOYE Team

- Tabs: Dashboard P&L, Monthly Revenue (NGN), Monthly Expenses (NGN), Tax Reserve, Cash Runway Tracker.`
  },
  {
    product_id: 'P-GOYE-019',
    product_name: 'Email Marketing Templates Pack - 25 Emails',
    category: 'Marketing Templates',
    short_description: '25 high-converting email sequences welcome sales nurture.',
    full_description: 'A comprehensive collection of 25 direct-response email templates. Contains a 5-part Welcome Series, a 7-day Product Launch Campaign, a 4-part Flash Promotion Sequence, and Cart Abandonment Recovery follow-ups designed to maximize conversions.',
    version: '1.0',
    creator: 'GOYE Team',
    ownership_status: 'OWNED_BY_GOYE',
    rights_documentation_status: 'Verified',
    commercial_use_permission_status: 'Commercial Allowed',
    file_type: 'DOCX',
    file_size: '2.1 MB',
    price: 5000,
    currency: 'NGN',
    product_status: 'Active',
    publication_date: '2026-03-08',
    last_updated: '2026-03-26',
    download_count: 0,
    sales_count: 0,
    file_path_private: '/private/products/19_goye_email_marketing_templates_pack_25_emails.docx',
    preview_image: '/src/assets/images/goye_marketing_planner_1790804210634.jpg',
    license_terms: 'Single buyer license, commercial use allowed, no redistribution/resale of file itself',
    usage_instructions: 'Download, open in compatible app, customize for your business',
    refund_policy_ref: 'Digital product, no refund after download, defective file replacement within 7 days',
    features: [
      '5-part automated subscriber welcome sequence',
      '7-day high-converting digital product launch campaign',
      '4-part cart/order abandonment recovery emails',
      'Client re-engagement and referral request scripts'
    ],
    intended_audience: 'E-commerce brands, digital creators, consultants, and course instructors.',
    content_document_text: `GOYE EMAIL MARKETING TEMPLATES PACK - 25 EMAILS
Version 1.0 | © 2026 GOYE. All Rights Reserved.
Creator: GOYE Team

Sequence 1: Welcome & Indoctrination (Emails 1-5)
Sequence 2: Product Launch & Offer Sprint (Emails 6-12)
Sequence 3: Abandoned Checkout & Recovery (Emails 13-16)
Sequence 4: Customer Retention & Referral (Emails 17-25)`
  },
  {
    product_id: 'P-GOYE-020',
    product_name: 'Brand Strategy Worksheet & Identity Kit',
    category: 'Marketing Templates',
    short_description: 'Complete brand strategy & guidelines workbook to position your business as premium.',
    full_description: 'A 24-page executive brand strategy workbook designed to craft an unmistakable commercial identity. Guides founders through defining their brand archetypes, unique value proposition, competitive moat, visual design direction, and tone of voice.',
    version: '1.0',
    creator: 'GOYE Team',
    ownership_status: 'OWNED_BY_GOYE',
    rights_documentation_status: 'Verified',
    commercial_use_permission_status: 'Commercial Allowed',
    file_type: 'PDF',
    file_size: '3.8 MB',
    price: 4500,
    currency: 'NGN',
    product_status: 'Active',
    publication_date: '2026-03-12',
    last_updated: '2026-03-26',
    download_count: 0,
    sales_count: 0,
    file_path_private: '/private/products/20_goye_brand_strategy_worksheet_and_identity_kit.pdf',
    preview_image: '/src/assets/images/goye_business_plan_1790804188811.jpg',
    license_terms: 'Single buyer license, commercial use allowed, no redistribution/resale of file itself',
    usage_instructions: 'Download, open in compatible app, customize for your business',
    refund_policy_ref: 'Digital product, no refund after download, defective file replacement within 7 days',
    features: [
      'Brand positioning statement formula',
      'Target customer avatar and psychographic interview sheet',
      'Tone of voice & copywriting vocabulary guide',
      'Visual asset guidelines (color psychology, typography pairings)'
    ],
    intended_audience: 'Founders, creative directors, brand consultants, and marketers.',
    content_document_text: `GOYE BRAND STRATEGY WORKSHEET & IDENTITY KIT
Version 1.0 | © 2026 GOYE. All Rights Reserved.
Creator: GOYE Team

1. Brand Purpose & Commercial Mission
2. Ideal Customer Avatar & Emotional Drivers
3. Brand Voice Matrix: How We Sound vs How We Never Sound
4. Visual Identity Principles & Design Guardrails`
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  contactWhatsApp: '+234 800 000 0000',
  contactEmail: 'goyedagosmessenterprise@gmail.com',
  contactPhone: '+234 800 000 0000',
  supportHours: 'Monday – Friday: 8:00 AM – 6:00 PM (WAT)',
  refundPolicy: `GOYE DIGITAL PRODUCTS REFUND & REPLACEMENT POLICY

Effective Date: January 1, 2026
Business: GOYE DIGITAL MARKETPLACE
Contact: goyedagosmessenterprise@gmail.com

1. NATURE OF DIGITAL GOODS
Due to the digital and downloadable nature of the products sold on GOYE DIGITAL MARKETPLACE, files are delivered immediately upon confirmed payment. As digital goods cannot be physically returned or un-downloaded, all sales of downloadable digital products are generally final.

2. TECHNICAL DEFECT GUARANTEE
If a downloaded file is corrupted, unreadable, incomplete, or technically defective, GOYE will provide an immediate replacement file or alternative format within 24 hours of notification. If we are unable to supply a working version of the purchased product within 7 days, a 100% refund will be issued via the original payment method.

3. REFUND ELIGIBILITY CRITERIA
Refunds are considered only under verified conditions:
a) The customer was charged twice due to a payment gateway processing error (duplicate charge).
b) The digital file is verified as defective or missing core advertised content, and technical support cannot resolve the issue.

4. HOW TO REQUEST SUPPORT OR REPLACEMENT
To request assistance with an order, email goyedagosmessenterprise@gmail.com with your Order ID, purchase email, and details of the technical issue.`,
  termsOfService: `GOYE DIGITAL MARKETPLACE – TERMS OF SERVICE

1. ACCEPTANCE OF TERMS
By accessing or purchasing from GOYE DIGITAL MARKETPLACE ("GOYE"), you agree to these Terms of Service.

2. ORIGINALITY & INTELLECTUAL PROPERTY
All digital products, templates, workbooks, guides, and prompts published on this marketplace are the intellectual property of GOYE and owned by GOYE (OWNED_BY_GOYE). Unauthorized redistribution, mass sharing, scraping, or re-sale is strictly prohibited under international copyright laws.

3. LICENSE TIERS & PERMITTED USE
Single buyer license, commercial use allowed within the buyer's own business or consultancy, no redistribution or resale of the raw file itself.

4. PAYMENT & VERIFICATION
Access to products is granted ONLY after genuine verification through authorized payment gateways (Paystack or Flutterwave). Currency is NGN only.`,
  privacyPolicy: `GOYE DIGITAL MARKETPLACE – PRIVACY POLICY

We collect only the minimum information required to deliver your digital orders: your Name, Email Address, and Payment Reference. We do not store full credit card numbers or banking passwords on our servers.`,
  licenseTermsSummary: 'Single buyer license, commercial use allowed, no redistribution/resale of file itself',
  paystackEnabled: true,
  flutterwaveEnabled: true,
  paystackConfigured: true,
  flutterwaveConfigured: true
};
