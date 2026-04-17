// ══════════════════════════════════════════════════════════
//  PRODUCTS — Salesforce Cloud Project Ideas
// ══════════════════════════════════════════════════════════
const PRODUCTS = {

  salesCloud: {
    id:'salesCloud', title:'Sales Cloud', icon:'💼', color:'#0176D3', darkColor:'#032D60',
    desc:'Build, configure and automate the end-to-end sales process — from lead capture to deal close.',
    tags:['CRM','Opportunities','Forecasting','CPQ','Territory Management'],
    projects:[
      {
        id:'lead-scoring', title:'Intelligent Lead Scoring & Auto-Routing System',
        overview:'Build an automated system that scores inbound leads based on demographic fit, behavioral signals, and engagement data, then routes them to the most qualified sales rep using assignment rules and Apex. The goal is to reduce time-to-contact for hot leads and improve conversion rates.',
        duration:'4–6 weeks', difficulty:'Intermediate', teamSize:'1–2 Developers',
        techStack:['Apex (Batch & Triggers)','Custom Fields on Lead','Flow Builder','Assignment Rules','Reports & Dashboards','LWC Score Widget','Custom Metadata for scoring rules'],
        steps:[
          {title:'Define Scoring Model', detail:'Work with sales leadership to identify scoring criteria: company size, industry, job title, website visits, email opens, form submissions. Assign point values (e.g., VP title = 20pts, correct industry = 15pts). Document in a scoring matrix.'},
          {title:'Create Custom Fields & Objects', detail:'Add fields to Lead: Lead_Score__c (Number), Lead_Grade__c (Picklist: A/B/C/D), Score_Last_Calculated__c (DateTime), Scoring_Notes__c (Long Text). Create Scoring_Rule__mdt Custom Metadata to store adjustable rule weights.'},
          {title:'Build Apex Scoring Engine', detail:'Write LeadScoringService.cls with calculateScore(Lead l) method. Build LeadScoringBatch for nightly recalculation of all active leads. Write LeadScoringTrigger to score on insert/update for real-time scoring.'},
          {title:'Configure Routing with Assignment Rules', detail:'Create Lead Assignment Rules triggered by grade thresholds (Grade A → Top Sales Rep queue, Grade B → Round-robin pool, Grade C → SDR team). Use Apex Assignment overrides for complex territory-based routing.'},
          {title:'Build LWC Score Indicator', detail:'Create leadScoreWidget LWC component showing a visual gauge, score breakdown tooltip, and trend arrow. Add to Lead record page layout via App Builder. Wire to custom Apex controller for score history data.'},
          {title:'Build Dashboard & Alerts', detail:'Create Reports: Score Distribution by Source, Grade Trend by Week, Conversion Rate by Grade. Build Dashboard for Sales Manager. Create Flow to send Slack/Email alert when a lead crosses Grade A threshold.'},
          {title:'Test & Optimize', detail:'Run A/B comparison of routed vs. unrouted leads over 4 weeks. Analyze conversion rates by grade. Tune scoring weights in Custom Metadata (no code deployment needed). Write Apex test classes covering all scoring scenarios.'}
        ],
        approach:'Use a service-layer pattern (LeadScoringService) called from both a trigger handler and a scheduled batch. Store scoring rules in Custom Metadata to allow business users to adjust weights without developer involvement. The LWC widget reads from a cached Apex controller to avoid live recalculation on every page load.',
        architecture:[
          {layer:'Data Layer', detail:'Lead object + custom fields, Scoring_Rule__mdt for configurable weights'},
          {layer:'Service Layer', detail:'LeadScoringService.cls — pure scoring logic, testable in isolation'},
          {layer:'Automation Layer', detail:'Trigger on insert/update + nightly Batch for bulk recalculation'},
          {layer:'UI Layer', detail:'LWC Score Widget on record page + Reports/Dashboard'},
          {layer:'Routing Layer', detail:'Assignment Rules + optional Apex Assignment override'}
        ],
        deliverables:['Lead_Score__c and Lead_Grade__c custom fields deployed','LeadScoringService.cls with ≥85% test coverage','LeadScoringBatch scheduled nightly','LWC Score Indicator widget on Lead record page','3 Reports + 1 Sales Manager Dashboard','Assignment Rules for each lead grade','Custom Metadata records for scoring weights']
      },
      {
        id:'territory-quota', title:'Territory Management & Quota Tracking Dashboard',
        overview:'Implement Enterprise Territory Management (ETM) to assign accounts to sales territories based on geography and industry, then build a real-time quota tracking dashboard showing each rep\'s attainment vs. target with drill-down capability.',
        duration:'3–4 weeks', difficulty:'Intermediate', teamSize:'1–2 Developers',
        techStack:['Enterprise Territory Management','Collaborative Forecasting','LWC Dashboard','SOQL Aggregate Queries','Reports & Dashboards','Custom Objects for Quota','Apex REST for ERP sync'],
        steps:[
          {title:'Enable & Configure ETM', detail:'Enable Enterprise Territory Management in Setup. Define Territory Model (aligned to org hierarchy). Create Territory Types (Geographic: East/West/Central, Vertical: Healthcare/Finance/Retail). Build Territory Hierarchy matching sales org structure.'},
          {title:'Design Quota Data Model', detail:'Create Quota__c custom object with fields: Territory__c (lookup), Rep__c (User lookup), Fiscal_Period__c, Target_Amount__c, Product_Category__c. Create Quota_Period__c master object for period management. Build import template for annual quota upload.'},
          {title:'Build Territory Assignment Rules', detail:'Create Account territory assignment rules (State/Country for geographic territories, Industry for vertical territories). Write Apex to handle edge cases (accounts spanning multiple territories, named accounts). Enable Opportunity splits for shared territory deals.'},
          {title:'Configure Collaborative Forecasting', detail:'Enable Collaborative Forecasting. Set up Forecast Categories (Pipeline, Best Case, Commit, Closed). Configure Forecast Hierarchy to match Territory Model. Enable Quota Tracking against Forecast Types.'},
          {title:'Build LWC Quota Dashboard', detail:'Create quotaDashboard LWC component. Use @wire to call QuotaService Apex methods. Display: attainment gauge (% of quota achieved), monthly trend bar chart, team leaderboard, pipeline coverage ratio. Add drill-down to individual rep view.'},
          {title:'Automate Quota Rollup', detail:'Build QuotaRollupBatch to aggregate rep quotas to territory and region level. Schedule monthly. Create Apex trigger on Opportunity (stage = Closed Won) to update attainment records. Build Flow to create quota record when new rep joins territory.'}
        ],
        approach:'Keep the Territory Model simple initially (2-3 levels). Use a dedicated Quota__c object separate from Salesforce\'s native forecasting to allow custom reporting dimensions (product line, industry). The LWC dashboard uses aggregate SOQL queries to compute attainment in real time without relying on scheduled reports.',
        architecture:[
          {layer:'Territory Layer', detail:'ETM Territory Model + Assignment Rules'},
          {layer:'Quota Data Model', detail:'Quota__c and Quota_Period__c custom objects'},
          {layer:'Forecasting', detail:'Collaborative Forecasting + Opportunity Splits'},
          {layer:'Dashboard', detail:'LWC Real-time Dashboard + native Reports'}
        ],
        deliverables:['Territory Model with 3-level hierarchy deployed','Quota__c custom object with bulk import template','LWC Quota Dashboard with gauge + trend charts','QuotaRollupBatch scheduled monthly','Assignment Rules for 5+ territory types','Manager vs Rep view toggle in dashboard']
      },
      {
        id:'cpq-system', title:'CPQ — Configure Price Quote Automation',
        overview:'Build a full Configure-Price-Quote (CPQ) solution enabling sales reps to build complex product bundles, apply discount rules, generate PDF quotes, and route for approval — all within Salesforce. Uses Salesforce CPQ (Steelbrick) or a custom-built CPQ on standard objects.',
        duration:'8–12 weeks', difficulty:'Advanced', teamSize:'2–3 Developers',
        techStack:['Salesforce CPQ (Managed Package)','Apex Price Rules','LWC Quote Builder','Visualforce PDF Generation','DocuSign Integration','Approval Processes','Flow Builder','CPQ APIs'],
        steps:[
          {title:'Product Catalog & Bundle Configuration', detail:'Create Product2 records for all sellable items. Define Product Bundles (parent + child components). Set up Product Features and Options (e.g., Base + Add-ons). Configure Product Rules (validation, selection, alert) to enforce business constraints.'},
          {title:'Pricing Rules & Discount Schedules', detail:'Create Price Rules with conditions (volume discounts, partner tiers, promotional pricing). Build Discount Schedules for volume-based tiers. Configure Price Books for different customer segments. Implement Contracted Pricing for existing customers.'},
          {title:'Quote Line Editor & LWC Customization', detail:'Customize the CPQ Quote Line Editor with custom fields (Margin%, Competitor, Justification). Build LWC sidebar component for product comparison. Add real-time margin calculator widget. Create custom Quick Action for fast re-quote from Won Opportunities.'},
          {title:'Approval Workflow', detail:'Create multi-level Approval Process: Rep discount 0-10% (auto-approved), 10-20% (manager), 20%+ (VP). Build CPQ Approval Conditions using Apex. Configure Approval reminders via Flow. Add approval status to quote PDF header.'},
          {title:'PDF Quote Generation', detail:'Design branded Quote PDF template using CPQ Quote Templates. Add dynamic sections (terms by region, product images, signature block). Integrate DocuSign for e-signature. Auto-generate PDF on quote status = Presented.'},
          {title:'Opportunity & Order Sync', detail:'Configure CPQ Order generation from approved Quotes. Map Quote Lines to Order Products and Assets. Build Apex trigger to update Opportunity stage and amount when Quote is approved. Create Revenue Schedule for subscription products.'}
        ],
        approach:'Start with a simple product catalog and add complexity incrementally. Use Salesforce CPQ package APIs for customizations to avoid breaking upgrades. Store all pricing logic in CPQ Price Rules (not in Apex triggers) to leverage CPQ\'s built-in calculation engine. Separate Quote configuration from Approval logic.',
        architecture:[
          {layer:'Product Catalog', detail:'Product2 + CPQ Product Bundles + Price Books'},
          {layer:'Pricing Engine', detail:'CPQ Price Rules + Discount Schedules'},
          {layer:'Quote UI', detail:'CPQ Quote Line Editor + LWC customizations'},
          {layer:'Approval Layer', detail:'CPQ Approvals + native Approval Process'},
          {layer:'Document Layer', detail:'CPQ Quote Templates + DocuSign integration'}
        ],
        deliverables:['Full product catalog with bundles (min 10 products)','3-tier discount approval workflow','Branded PDF quote template','DocuSign e-signature integration','Auto-order generation from approved quotes','LWC margin calculator widget','90%+ test coverage on all custom Apex']
      }
    ]
  },

  serviceCloud: {
    id:'serviceCloud', title:'Service Cloud', icon:'🎧', color:'#04844B', darkColor:'#023B2A',
    desc:'Build intelligent customer service solutions — omni-channel routing, AI-powered knowledge, and field service.',
    tags:['Case Management','Omni-Channel','Knowledge Base','Field Service','AI Einstein'],
    projects:[
      {
        id:'omni-channel', title:'Omni-Channel Case Management System',
        overview:'Implement a full omni-channel customer service platform that automatically captures cases from Email, Web, Chat, and Social channels, routes them to the right agent using skills-based routing, and provides agents with a 360° customer view in the Service Console.',
        duration:'6–8 weeks', difficulty:'Intermediate', teamSize:'2–3 Developers',
        techStack:['Omni-Channel Routing','Email-to-Case','Web-to-Case','Live Agent/Chat','Social Customer Service','LWC Service Console','Einstein Classification','Flows for Escalation','Knowledge Base'],
        steps:[
          {title:'Configure Case Capture Channels', detail:'Set up Email-to-Case with org-wide email address per product line. Configure Web-to-Case form with reCAPTCHA. Enable Chat (Embedded Service SDK) on website. Set up Social Studio for Twitter/Facebook cases. Map each channel to a specific Origin picklist value for reporting.'},
          {title:'Design Omni-Channel Routing Strategy', detail:'Create Queues by product, region, and priority (Tier 1, Tier 2, VIP). Configure Service Channels for each case type. Build Routing Configurations with balanced/least active/most available routing. Create Skills (Language, Product, Certification) and assign to agents.'},
          {title:'Implement Skills-Based Routing', detail:'Enable Skills-Based Routing. Create Apex RoutingService to evaluate incoming cases and enqueue to correct queue. Write Flow to read Case fields (Language__c, Product__c, Priority) and set routing skills using Omni-Channel APIs. Build escalation timer (SLA breach → manager queue).'},
          {title:'Configure SLA Entitlements', detail:'Create Entitlement Processes for Standard (8hr), Priority (4hr), and VIP (1hr) SLAs. Set up Milestone Actions for First Response and Resolution. Create Apex MilestoneTimer to calculate breach risk. Build real-time SLA countdown LWC for agent console.'},
          {title:'Build Agent Service Console', detail:'Create Lightning App with Service Console layout. Add Knowledge sidebar, Case Timeline, Customer 360 panel, SLA countdown widget, and Related Cases views. Build LWC "Smart Replies" panel that suggests Knowledge Articles as agent types.'},
          {title:'Enable Einstein Case Classification', detail:'Enable Einstein Classification for auto-populating Case Type, Priority, and Product from case subject/description. Train the model with 1,000+ historical cases. Build Flow to apply suggested classification when confidence > 80%. Track classification accuracy in dashboard.'},
          {title:'Build Supervisor Dashboard', detail:'Create Reports: Cases by Channel/Hour, Agent Handle Time, CSAT by Queue, SLA Compliance %. Build real-time Supervisor Dashboard (Omni-Channel Wallboard alternative) using LWC + Apex aggregate queries refreshing every 60 seconds.'}
        ],
        approach:'Layer the solution: channels → queue → routing → SLA → resolution. Keep routing logic in a dedicated RoutingService Apex class so it can be tested without triggering actual Omni-Channel assignments. Use Custom Metadata to store SLA thresholds so operations can adjust without code changes.',
        architecture:[
          {layer:'Intake Layer', detail:'Email-to-Case, Web-to-Case, Chat, Social'},
          {layer:'Routing Layer', detail:'Omni-Channel + Skills-Based Routing + Apex RoutingService'},
          {layer:'SLA Layer', detail:'Entitlement Processes + Milestone Actions'},
          {layer:'Agent UI', detail:'Service Console + LWC widgets'},
          {layer:'AI Layer', detail:'Einstein Classification + Smart Replies'}
        ],
        deliverables:['4+ intake channels configured (Email, Web, Chat, Social)','Skills-based routing for 3 tier queues','SLA Entitlements for Standard/Priority/VIP','Einstein Classification with >80% accuracy','LWC SLA countdown widget in console','Real-time Supervisor Dashboard','Case deflection rate improvement >15%']
      },
      {
        id:'knowledge-base', title:'AI-Powered Self-Service Knowledge Base',
        overview:'Build a comprehensive Knowledge Base integrated with Experience Cloud, powered by Einstein Article Recommendations. Customers can find answers via intelligent search, and agents get real-time article suggestions as they type case notes — reducing handle time and improving deflection.',
        duration:'4–5 weeks', difficulty:'Intermediate', teamSize:'1–2 Developers',
        techStack:['Salesforce Knowledge','Einstein Article Recommendations','Experience Cloud','LWC Search Component','Apex SearchService','Natural Language Search','Case Deflection Analytics','Flow for Article Feedback'],
        steps:[
          {title:'Configure Knowledge & Article Types', detail:'Enable Knowledge in Setup. Create Article Types: How-To, FAQ, Known Issue, Release Note, Policy. Define custom fields: Affected_Products__c, Applicable_Regions__c, Article_Version__c, Avg_Rating__c. Set up Translation Workflow for multi-language articles.'},
          {title:'Build Article Lifecycle Workflow', detail:'Create Draft → Review → Published → Archived workflow using Knowledge Management. Build Approval Process for articles affecting compliance or pricing. Create Flow to auto-archive articles older than 2 years with no views. Set up versioning to track article changes.'},
          {title:'Enable Einstein Article Recommendations', detail:'Enable Einstein Article Recommendations in Setup. Configure the recommendation panel in Service Console. Train on case-to-article usage data (min 100 case-article pairs). Build Apex wrapper to call Einstein recommendations API for custom placements.'},
          {title:'Build Experience Cloud Self-Service Portal', detail:'Create Customer Community using Customer Service template. Add Knowledge component with filtered search (by product, category, language). Create custom LWC search bar with autocomplete using SOSL. Embed chatbot (Einstein Bot) for guided FAQ resolution.'},
          {title:'Implement Case Deflection Tracking', detail:'Add "Was this helpful?" and "Did this resolve your issue?" buttons to every article view (LWC). Create Article_Feedback__c object to store responses. Track Deflection Rate = (sessions with article view + no case created) / total sessions. Add to executive dashboard.'},
          {title:'Build Agent Smart Sidebar', detail:'Create LWC ArticleSuggestions component for Service Console. Wire to Einstein recommendations API. Show top-3 articles with relevance score. Allow 1-click attach to case. Track which suggestions are accepted to improve the model over time.'}
        ],
        approach:'Separate the article data model from the recommendation layer. Focus on article quality first (well-tagged, structured articles) before enabling Einstein — garbage in, garbage out. The Experience Cloud portal and the Service Console sidebar share the same Apex SearchService layer.',
        architecture:[
          {layer:'Content Layer', detail:'Knowledge Articles + Article Types + Translation'},
          {layer:'Search Layer', detail:'SOSL + Einstein Recommendations API'},
          {layer:'Portal Layer', detail:'Experience Cloud Customer Portal'},
          {layer:'Console Layer', detail:'LWC Smart Sidebar for agents'},
          {layer:'Analytics Layer', detail:'Deflection metrics + Article performance'}
        ],
        deliverables:['Knowledge article templates for 4 article types','Einstein Article Recommendations configured','Experience Cloud self-service portal','LWC Smart Sidebar in Service Console','Article feedback mechanism (thumbs up/down)','Case Deflection Rate dashboard','Multi-language article support (2 languages)']
      },
      {
        id:'field-service', title:'Field Service Mobile App & Dispatch System',
        overview:'Implement Salesforce Field Service (FSL) for a service organization dispatching technicians to customer sites. Includes intelligent scheduling, real-time route optimization, a mobile app for technicians, inventory management, and SLA-driven priority scoring.',
        duration:'8–10 weeks', difficulty:'Advanced', teamSize:'2–3 Developers',
        techStack:['Field Service Lightning (FSL)','Scheduling & Optimization','FSL Mobile App','Work Orders & Work Types','Inventory & Parts','Service Territories','Apex for custom scheduling','Maps & Routing APIs'],
        steps:[
          {title:'Enable & Configure FSL', detail:'Enable Field Service in Setup. Install FSL managed package. Create Service Territories (regions). Create Operating Hours for each territory. Define Resource Types (Technician, Inspector, Supervisor). Create Permission Sets for dispatchers, mobile users, and managers.'},
          {title:'Define Work Types & Skills', detail:'Create Work Types: Installation, Repair, Preventive Maintenance, Inspection. Assign Estimated Duration per work type. Create Skills: Electrical, HVAC, Plumbing, Certification Level 1/2/3. Map skills to work types as requirements. Enable Crew Management for complex jobs.'},
          {title:'Build Scheduling & Optimization', detail:'Configure Scheduling Policy (optimize for travel time, skills, SLA). Enable Optimization Jobs for auto-scheduling. Build Apex SchedulingService to handle emergency dispatch override. Create Apex logic for priority scoring (VIP customer = always schedule within 4hrs).'},
          {title:'Configure Mobile App', detail:'Customize FSL Mobile for technicians: work order checklist, photo capture, signature collection, parts used tracking. Enable offline mode for areas with poor connectivity. Create Quick Actions for common updates (status change, part request, appointment reschedule).'},
          {title:'Inventory & Parts Management', detail:'Create Products and Pricebooks for service parts. Create Product Consumed records on Work Orders. Build Parts Request Flow (technician requests part → dispatcher approves → warehouse ships). Track parts van inventory per service resource.'},
          {title:'Build Dispatcher Console Enhancements', detail:'Customize Dispatcher Console with LWC overlays. Add SLA breach risk heat map. Build Gantt-style schedule view with drag-and-drop. Create alert banner for overdue work orders. Add travel time visualization on the map.'}
        ],
        approach:'Start with manual scheduling and progressively enable automation. Pilot with a single service territory before rolling out org-wide. Use the FSL optimization API as a black box initially — tune scheduling policies before customizing with Apex.',
        architecture:[
          {layer:'Work Management', detail:'Work Orders + Work Types + Service Appointments'},
          {layer:'Resource Layer', detail:'Service Resources + Skills + Territories'},
          {layer:'Scheduling', detail:'FSL Scheduling Engine + Apex Override'},
          {layer:'Mobile', detail:'FSL Mobile App (offline-capable)'},
          {layer:'Parts', detail:'Inventory + Products Consumed + Parts Request Flow'}
        ],
        deliverables:['FSL configured for 3 service territories','5 work types with skill requirements','Mobile app with offline support','Auto-scheduling optimization enabled','Parts tracking and consumption recording','Dispatcher Console with SLA heat map','KPI Dashboard: First-Time Fix Rate, Avg Travel Time, SLA Compliance']
      }
    ]
  },

  marketingCloud: {
    id:'marketingCloud', title:'Marketing Cloud', icon:'📧', color:'#1589EE', darkColor:'#032D60',
    desc:'Design automated customer journeys, personalized email campaigns, and data-driven marketing automation.',
    tags:['Journey Builder','Email Studio','Automation Studio','AMPscript','SFMC APIs','Personalization'],
    projects:[
      {
        id:'onboarding-journey', title:'Automated Customer Onboarding Journey',
        overview:'Build a multi-touch, personalized onboarding email journey for new customers using Journey Builder. The journey spans 30 days with triggered emails, SMS touchpoints, and decision splits based on product activation status — automatically moving customers through milestones.',
        duration:'3–4 weeks', difficulty:'Intermediate', teamSize:'1–2 Marketers/Developers',
        techStack:['Journey Builder','Email Studio','MobileConnect (SMS)','Contact Builder','AMPscript Personalization','Data Extensions','Marketing Cloud Connect','Automation Studio','Analytics Builder'],
        steps:[
          {title:'Map the Onboarding Journey Flow', detail:'Workshop with product and CS teams to define milestones: Account Created → Product Activated → First Transaction → 7-Day Review → 30-Day Health Check. Define exit criteria (unsubscribed, churned). Document the decision tree for each split point.'},
          {title:'Build Data Extensions', detail:'Create DE: Onboarding_Contacts (CustomerID, Name, Email, Product, ActivationDate, Segment), Activation_Events (API-updated), Journey_Progress (tracks current step). Establish sync from Salesforce CRM via Marketing Cloud Connect for real-time CRM updates.'},
          {title:'Design & Build Email Templates', detail:'Create Master Template in Content Builder (header, footer, unsubscribe, brand guidelines). Build 6 email templates: Welcome, Getting Started, Activation Reminder, First Milestone, Power User Tips, 30-Day Review. Use AMPscript for dynamic content blocks (product name, rep name, usage stats).'},
          {title:'Configure Journey in Journey Builder', detail:'Create Journey with Entry Source = DE (new records trigger entry). Add Wait activities, Decision Splits (Is_Activated__c = true), Email Send activities, SMS activities (for non-openers after 48hrs), and Salesforce Activity (update CRM record on milestone reached).'},
          {title:'Implement AMPscript Personalization', detail:'Use AMPscript Lookup() to pull usage data from DE. Add conditional blocks: IF product = Enterprise THEN show advanced features block. Use DataExtensionRowCount() to show progress indicators. Implement Subject Line personalization with first name + product.'},
          {title:'Test & Launch', detail:'Use Journey Builder Preview to simulate contact path. Send test emails to seed list. Validate AMPscript rendering. Check unsubscribe/preference center links. Enable Email Send Logging. Soft-launch with 10% of new contacts; monitor engagement for 1 week before full rollout.'}
        ],
        approach:'Design for the journey exit as much as the entry. Every path must have a graceful exit (unsubscribe, customer reached rep, churned). Keep AMPscript logic in Content Builder snippets for reuse across templates. Use Journey Builder\'s Goal feature to measure success (activation rate).',
        architecture:[
          {layer:'Data Layer', detail:'Data Extensions + MC Connect sync from CRM'},
          {layer:'Content Layer', detail:'Email Templates + AMPscript personalization'},
          {layer:'Journey Layer', detail:'Journey Builder multi-touch automation'},
          {layer:'Channel Layer', detail:'Email + SMS + CRM activity updates'},
          {layer:'Analytics', detail:'Journey Analytics + Email performance reports'}
        ],
        deliverables:['6-email onboarding sequence with AMPscript','SMS touchpoints for non-opener re-engagement','Journey Builder flow with decision splits','Marketing Cloud Connect CRM sync','Analytics report: activation rate by segment','Preference center + unsubscribe flow','A/B test on Welcome email subject lines']
      },
      {
        id:'re-engagement', title:'Win-Back Re-Engagement Campaign Engine',
        overview:'Build a sophisticated re-engagement campaign system for lapsed customers using SQL-based audience segmentation in Automation Studio, with multi-wave email sequences, A/B testing, and automatic suppression of re-engaged contacts.',
        duration:'2–3 weeks', difficulty:'Intermediate', teamSize:'1 Developer',
        techStack:['Automation Studio','SQL Activities','Email Studio','Journey Builder','A/B Testing','AMPscript','Content Builder','Contact Builder','Einstein Engagement Scoring'],
        steps:[
          {title:'Define Lapsed Customer Segments', detail:'Query database to identify inactive customers. Use SQL to create 3 segments: Lapsed_30d (no purchase 30-60 days), Lapsed_90d (60-120 days), Lapsed_180d (120+ days). Include RFM scoring (Recency, Frequency, Monetary value) to prioritize high-value lapsed customers.'},
          {title:'Build SQL Automation', detail:'Write SQL queries in Automation Studio to populate lapsed segment DEs nightly. Include suppression join (exclude unsubscribes, bounces, recent purchasers). Schedule Automation to run at 2 AM daily. Build audit DE to track segment membership changes over time.'},
          {title:'Create Email Content Sequences', detail:'Design 3-email sequences per segment: Email 1 (We miss you + incentive offer), Email 2 (Last chance for offer + social proof), Email 3 (Final goodbye + survey link). Use AMPscript to personalize with last purchase, product category, and rep name. Vary messaging by segment age.'},
          {title:'A/B Test Strategy', detail:'A/B test Email 1 subject lines: Test A ("We miss you, [FirstName]") vs Test B ("[Product] updates just for you"). Set winner criteria: best open rate after 24 hours. Use Journey Builder A/B test split with 20%/20% test, 60% hold. Roll out winner to remaining 60%.'},
          {title:'Configure Re-Engagement Tracking', detail:'Create Re_Engaged DE updated via Automation when a contact makes a purchase or opens 3+ emails. Build suppression list that auto-removes re-engaged contacts from future re-engagement sends. Create Flow in Journey Builder to update Salesforce CRM "Re-engaged" flag.'},
          {title:'Report on Campaign Performance', detail:'Build Analytics Builder Report: Re-engagement Rate by Segment, Revenue Recovered, Email Performance by Wave, Unsubscribe Impact. Set up weekly automated report email to CMO. Define success KPI: >15% re-engagement rate for 30-day lapsed segment.'}
        ],
        approach:'SQL quality determines campaign quality — invest time in clean segment definitions with proper suppression joins. Keep email content focused on a single CTA per email. Resist adding too many offers; scarcity drives re-engagement better than choice overload.',
        architecture:[
          {layer:'Segmentation', detail:'SQL Automation Studio + nightly refresh'},
          {layer:'Suppression', detail:'Unsubscribe + bounce + re-engaged suppress lists'},
          {layer:'Content', detail:'3-email sequences with AMPscript personalization'},
          {layer:'Testing', detail:'Journey Builder A/B split + winner logic'},
          {layer:'Analytics', detail:'Re-engagement rate + revenue recovery reports'}
        ],
        deliverables:['3-segment SQL queries (30/90/180 day lapsed)','Nightly automation populating segment DEs','9 email templates (3 per segment)','A/B test framework with auto winner selection','Re-engaged suppression automation','Analytics dashboard: re-engagement rate + revenue','CRM sync for re-engaged flag update']
      },
      {
        id:'transactional-email', title:'Transactional Email & Notification Service',
        overview:'Build a robust transactional email service using Marketing Cloud Triggered Sends and REST API for order confirmations, password resets, shipping notifications, and account alerts — with template management, delivery tracking, and retry logic.',
        duration:'2–3 weeks', difficulty:'Intermediate', teamSize:'1 Developer',
        techStack:['Triggered Send Definitions','Marketing Cloud REST API','AMPscript','Content Builder','Data Extensions','Send Logging','Automation for monitoring','MobileConnect for SMS'],
        steps:[
          {title:'Design Transactional Email Templates', detail:'Create templates for: Order Confirmation, Shipping Notification, Delivery Confirmation, Password Reset, Account Alert, Invoice. Use dynamic AMPscript content blocks for order line items (loop through OrderItems DE). Ensure CAN-SPAM compliance and mobile-responsive design.'},
          {title:'Configure Triggered Send Definitions', detail:'Create a Triggered Send Definition for each email type. Set Classification to Transactional. Configure From Name, From Email (per brand), and Reply-To. Set throttle rate for bulk triggers. Create test send for each definition.'},
          {title:'Build API Integration Layer', detail:'Document REST API endpoints for each trigger type. Build Apex class (for Salesforce callers) and expose REST endpoint for external systems. Use Marketing Cloud REST API: POST /messaging/v1/messageDefinitionSends/{id}/send. Implement retry logic with 3 attempts and exponential backoff for failed sends.'},
          {title:'Implement Dynamic Content with AMPscript', detail:'Build AMPscript for order item loop: %%[FOR @i = 1 TO RowCount(@rows) DO]%%. Dynamic product images by SKU. Conditional tracking links by region. Promo block for first-time purchasers. Order total calculation with tax and shipping.'},
          {title:'Send Logging & Monitoring', detail:'Enable Send Logging to capture all transactional sends. Create monitoring Automation that checks for delivery failures daily (SQL against send log). Build alert Flow to notify IT if delivery rate drops below 95%. Create Send Log dashboard in Analytics Builder.'},
          {title:'Add SMS Fallback', detail:'For critical alerts (order shipped, password reset), add MobileConnect SMS send 15 minutes after email if email not opened. Use Journey Builder API event entry. Include opt-in/opt-out management.'}
        ],
        approach:'Treat transactional emails as product features — they must be reliable, fast (<5 seconds delivery), and never miss. Build robust error handling and retry at the API layer. Keep template logic simple (AMPscript complexity can cause rendering failures). Test every template with dummy data before go-live.',
        architecture:[
          {layer:'API Layer', detail:'REST API endpoints + Apex integration wrapper'},
          {layer:'Template Layer', detail:'Content Builder templates + AMPscript dynamic content'},
          {layer:'Trigger Layer', detail:'Triggered Send Definitions per email type'},
          {layer:'Logging', detail:'Send Logging DE + monitoring automation'},
          {layer:'Fallback', detail:'SMS via MobileConnect for critical alerts'}
        ],
        deliverables:['6 transactional email templates (mobile-responsive)','Triggered Send Definitions for each type','REST API integration guide + Postman collection','AMPscript order line item loop','Retry logic for failed sends (3 attempts)','Send Log monitoring dashboard','SMS fallback for order shipped + password reset']
      }
    ]
  },

  healthCloud: {
    id:'healthCloud', title:'Health Cloud', icon:'🏥', color:'#0176D3', darkColor:'#1B3A5C',
    desc:'Build patient-centric healthcare solutions — care management, prior authorizations, and population health analytics.',
    tags:['Care Management','Patient 360','Prior Auth','Population Health','HIPAA','Care Teams'],
    projects:[
      {
        id:'patient-care', title:'Patient 360 Care Management Platform',
        overview:'Build a comprehensive patient care management platform on Health Cloud that gives care teams a 360° view of each patient — medical history, care plan, medications, appointments, social determinants of health, and care gaps — in a single unified console.',
        duration:'8–10 weeks', difficulty:'Advanced', teamSize:'2–4 Developers',
        techStack:['Health Cloud','Care Plans & Goals','LWC Patient Timeline','Care Team Management','OmniStudio','Flow Builder','HL7 FHIR Integration','Einstein Analytics (CRM Analytics)','EHR Integration'],
        steps:[
          {title:'Configure Health Cloud Data Model', detail:'Enable Health Cloud. Set up Individual model (Patient as Individual + PersonAccount). Configure Clinical data model: Clinical Encounters, Conditions, Medications, Allergies, Observations. Map EHR data fields to Health Cloud standard objects.'},
          {title:'Build EHR Integration', detail:'Create Named Credential for EHR system (Epic/Cerner). Build Apex FHIR integration service to fetch Patient resources, Conditions, MedicationRequests, and Observations. Schedule nightly sync. Build real-time refresh using Platform Events when EHR updates.'},
          {title:'Configure Care Plans & Goals', detail:'Create Care Plan templates for common conditions (Diabetes, Heart Disease, Post-Surgery). Define Health Concerns, Goals, and Tasks per template. Build LWC Care Plan Progress widget showing goal completion %. Configure Task assignment to Care Team members.'},
          {title:'Build Patient Timeline LWC', detail:'Create patientTimeline LWC showing chronological view of: clinical encounters, care plan updates, notes, lab results, medication changes, social assessments. Add filter by date range and event type. Enable care team members to add notes directly from timeline.'},
          {title:'Implement Care Team Management', detail:'Create Care Team Member types (PCP, Specialist, Care Manager, Social Worker, Caregiver). Build role-based access control (social worker sees social data only). Enable Care Team collaboration via Chatter. Build Care Team assignment automation based on patient condition and location.'},
          {title:'Build Care Gap Analytics', detail:'Create CRM Analytics dashboard: Care Gaps by Condition (patients due for screening), Medication Adherence Rates, Care Plan Completion %, High-Risk Patient cohort (AI-driven). Build automated outreach list for care managers based on gap priority.'}
        ],
        approach:'Lead with the data model — a well-designed Health Cloud schema that matches FHIR standards will make EHR integration smoother. Keep PHI access restricted using record-level security and field-level security, respecting HIPAA requirements at every layer.',
        architecture:[
          {layer:'Data Model', detail:'Health Cloud Individual model + Clinical Objects'},
          {layer:'Integration', detail:'FHIR API + EHR sync (Epic/Cerner/Athena)'},
          {layer:'Care Management', detail:'Care Plans + Goals + Task assignment'},
          {layer:'UI Layer', detail:'Patient 360 console + Timeline LWC'},
          {layer:'Analytics', detail:'Care Gaps + Population Health Dashboard'}
        ],
        deliverables:['Health Cloud configured with Individual data model','EHR integration (FHIR) for core clinical data','5 care plan templates for common conditions','Patient Timeline LWC component','Care Team management with role-based access','Care Gap dashboard in CRM Analytics','HIPAA access controls + field-level security documented']
      },
      {
        id:'prior-auth', title:'Prior Authorization Automation',
        overview:'Build an end-to-end Prior Authorization (PA) system that automates the submission, tracking, and management of PA requests between providers and payers — reducing administrative burden, accelerating approvals, and tracking appeal outcomes.',
        duration:'6–8 weeks', difficulty:'Advanced', teamSize:'2–3 Developers',
        techStack:['Health Cloud','OmniStudio (FlexCards + OmniScript)','Apex REST for payer APIs','Flow Builder','Document Generation','Approval Processes','Case Management','CRM Analytics'],
        steps:[
          {title:'Design PA Request Data Model', detail:'Create Prior_Auth_Request__c with fields: Patient, Provider, Payer, Service_Code (CPT), Diagnosis_Code (ICD-10), Requested_Service, Clinical_Documentation__c (multi-file), Status, Submitted_Date, Decision_Date, Auth_Number, Decision_Notes. Create PA_Appeal__c child object.'},
          {title:'Build PA Intake with OmniScript', detail:'Create OmniScript PA Intake Wizard: Step 1 (Patient lookup + demographics), Step 2 (Service & diagnosis codes), Step 3 (Clinical documentation upload), Step 4 (Urgency & clinical notes), Step 5 (Review & submit). Add real-time eligibility verification step using payer API.'},
          {title:'Integrate with Payer Systems', detail:'Build Apex PrayerIntegrationService implementing REST calls to major payer portals (CAQH, Availity, or direct payer APIs). Handle PA submission, status check, and response parsing. Implement webhook receiver for async payer callbacks. Map payer response codes to internal status picklist.'},
          {title:'Build Approval & Review Workflow', detail:'Create Approval Process for clinical review: Auto-approve standard services meeting criteria, Route complex cases to Medical Director, Flag urgent requests (SLA 72hrs). Build LWC clinical review console with patient history, clinical guidelines, and decision tools.'},
          {title:'Implement Appeals Management', detail:'Create appeal intake form (link to denied PA). Store appeal reason, additional documentation, and regulatory citations. Build appeal tracking timeline. Generate appeal letter PDF using document generation tool. Track appeal outcomes and calculate overturn rate.'},
          {title:'Build Operations Dashboard', detail:'Create CRM Analytics dashboard: PA Volume by Payer/Status/Service, Average Days to Decision, Approval vs. Denial Rate, Appeal Overturn Rate, Pending PA by Days Outstanding. Set up auto-escalation alert for PAs pending > SLA threshold.'}
        ],
        approach:'Prior Auth is heavily process-driven. Use OmniStudio to guide users through structured intake rather than free-form forms. The payer integration layer must be resilient — payer APIs are often unreliable, so implement circuit-breaker patterns and manual fallback paths.',
        architecture:[
          {layer:'Data Model', detail:'PA Request + Appeal + Document objects'},
          {layer:'Intake', detail:'OmniScript guided wizard'},
          {layer:'Integration', detail:'Payer API REST + webhook callbacks'},
          {layer:'Review', detail:'Approval Process + Medical Director console'},
          {layer:'Analytics', detail:'Approval rates + SLA compliance dashboard'}
        ],
        deliverables:['Prior Auth data model with appeals tracking','OmniScript PA intake wizard (5 steps)','Payer API integration for 2 major payers','Clinical review approval workflow','Appeal management with PDF generation','PA Operations dashboard in CRM Analytics','SLA escalation automation for pending PAs']
      },
      {
        id:'population-health', title:'Population Health Risk Stratification Dashboard',
        overview:'Build a population health management system that risk-stratifies patient panels, identifies care gaps, triggers proactive outreach for high-risk patients, and provides care managers with prioritized work lists — reducing ER visits and improving preventive care rates.',
        duration:'6–8 weeks', difficulty:'Advanced', teamSize:'2–3 Developers',
        techStack:['Health Cloud','CRM Analytics','Einstein Discovery','Apex Batch for risk scoring','Flow for outreach automation','OmniStudio FlexCards','EHR data integration','Custom Risk Score model'],
        steps:[
          {title:'Define Risk Stratification Model', detail:'Work with clinical team to define risk factors: age, chronic conditions (diabetes, CHF, COPD), medication adherence, ER utilization, social determinants (housing instability, food insecurity), gaps in preventive care. Assign weights. Classify into Low/Moderate/High/Very High risk tiers.'},
          {title:'Build Risk Scoring Engine', detail:'Create Apex RiskScoringBatch processing all active patients monthly. Pull clinical data from Health Cloud + EHR sync. Calculate composite risk score (0-100). Assign to risk tier. Store historical scores to track trajectory (improving/worsening). Tag patients with primary modifiable risk factors.'},
          {title:'Create Care Gap Detection', detail:'Build CareGapService identifying patients overdue for: Annual Wellness Visit, HbA1c testing (diabetics), Colorectal cancer screening, Flu vaccine, Mammogram. Create Care_Gap__c records with gap type, priority, and due date. Link to patient care plan goals.'},
          {title:'Build Proactive Outreach Automation', detail:'Create Flow triggered monthly: for Very High risk patients with care gaps → create Outreach Task for care manager, send patient SMS reminder, create Care Gap Note in Health Cloud. Build priority queue sorted by (Risk Score × Days Gap Overdue) for care manager work list.'},
          {title:'Build FlexCard for Care Manager Work List', detail:'Create OmniStudio FlexCard showing: Patient Name, Risk Tier badge (color coded), Top 3 care gaps, Days since last contact, Open tasks count. Enable click-through to patient record. Sort by priority score descending. Support batch update (mark multiple outreaches complete).'},
          {title:'Build CRM Analytics Population Dashboard', detail:'Create dashboard: Risk Distribution (% by tier), Care Gap Completion Rate trending, ER Utilization by Risk Tier, Top 10 High-Risk Patients needing immediate attention, Condition Prevalence heat map. Add predictive chart from Einstein Discovery (30-day ER risk).'}
        ],
        approach:'Risk stratification accuracy depends entirely on data completeness. Build data quality scores into the risk calculation — patients with incomplete records get flagged, not scored low. The outreach automation should feel like a nudge to care managers, not a flood. Start with your top 5% highest-risk patients.',
        architecture:[
          {layer:'Data Layer', detail:'Health Cloud + EHR clinical data'},
          {layer:'Scoring', detail:'Apex Risk Scoring Batch + Care Gap Service'},
          {layer:'Outreach', detail:'Flow automation + Task creation'},
          {layer:'UI Layer', detail:'OmniStudio FlexCard work list'},
          {layer:'Analytics', detail:'CRM Analytics Population Health Dashboard + Einstein Discovery'}
        ],
        deliverables:['Risk scoring model with 10+ risk factors','Apex RiskScoringBatch with monthly schedule','Care gap detection for 6 preventive measures','Proactive outreach automation Flow','OmniStudio FlexCard priority work list','CRM Analytics population health dashboard','Einstein Discovery 30-day ER risk prediction']
      }
    ]
  },

  dataCloud: {
    id:'dataCloud', title:'Data Cloud', icon:'🔮', color:'#8A3FFC', darkColor:'#2A1057',
    desc:'Unify customer data from all sources, build real-time segments, and activate personalized experiences at scale.',
    tags:['Identity Resolution','Unified Profiles','Real-time Segments','Data Streams','Activation','Einstein Studio'],
    projects:[
      {
        id:'unified-profile', title:'Unified Customer Profile System',
        overview:'Build a Unified Customer Profile in Data Cloud that connects data from CRM, eCommerce, mobile app, email platform, and support system into a single golden record per customer — enabling a true 360° view and eliminating data silos.',
        duration:'6–8 weeks', difficulty:'Advanced', teamSize:'2–3 Developers/Architects',
        techStack:['Data Cloud','Data Streams (Batch + Streaming)','Identity Resolution','Data Model (Individual/Party)','Calculated Insights','Profile API','Segment Builder','Activation to MC & Sales Cloud'],
        steps:[
          {title:'Assess & Map Data Sources', detail:'Inventory all customer data sources: CRM (Salesforce), eCommerce (Shopify/Magento), Mobile App (Firebase events), Email Platform (Marketing Cloud), Support System (Service Cloud). For each source: document schema, record volume, update frequency, key identifier fields (email, phone, CRM ID, cookie ID).'},
          {title:'Configure Data Streams', detail:'Create Data Streams for each source: Salesforce CRM connector (native), S3 batch connector for eCommerce exports, Streaming API connector for mobile app events (Firebase → Kinesis → Data Cloud Streaming API), Marketing Cloud connector. Map source fields to Data Cloud Data Model.'},
          {title:'Configure Identity Resolution', detail:'Create Identity Resolution ruleset: Primary key = Salesforce CRM ID, Fuzzy match rules for email (normalize to lowercase, handle aliases like "gmail.com" aliases), Phone normalization (E.164 format), Cookie reconciliation using deterministic device graphs. Set merge priority (CRM data wins over anonymous).'},
          {title:'Build Calculated Insights', detail:'Create Calculated Insights using SOQL-like queries: Total_Lifetime_Value (SUM of all purchases), Days_Since_Last_Purchase, Email_Engagement_Score (opens/clicks/30days), Support_Health_Score (inverse of open case count + CSAT), Product_Category_Affinity (most-purchased category).'},
          {title:'Create Real-Time Segments', detail:'Build segments: High Value Active (LTV > $5,000 + purchase in 90 days), At-Risk (High LTV + no purchase 60-120 days), New Customer (first purchase < 30 days), Multi-Product (purchased in 3+ categories), High Support Load (>3 open cases). Schedule refresh rates per segment urgency.'},
          {title:'Configure Activations', detail:'Activate High Value Active segment → Marketing Cloud for VIP Journey. Activate At-Risk segment → Sales Cloud (create task for account team). Activate New Customer → Marketing Cloud Onboarding Journey. Build Data Cloud Profile API endpoint for real-time website personalization.'}
        ],
        approach:'Identity Resolution quality is the foundation — a bad merge strategy creates worse outcomes than no merging. Start with deterministic matching (exact email/phone) before adding fuzzy matching. Run the resolution in evaluation mode first to review match confidence before activating.',
        architecture:[
          {layer:'Ingestion', detail:'Batch + Streaming Data Streams from 5 sources'},
          {layer:'Identity', detail:'Identity Resolution ruleset (deterministic + fuzzy)'},
          {layer:'Enrichment', detail:'Calculated Insights (LTV, engagement scores)'},
          {layer:'Segmentation', detail:'Segment Builder with real-time refresh'},
          {layer:'Activation', detail:'MC Journeys + Sales Cloud tasks + Profile API'}
        ],
        deliverables:['5 data sources connected via Data Streams','Identity Resolution ruleset with documented merge rules','5 Calculated Insights (LTV, engagement, affinity)','6 audience segments with refresh schedules','Activation to Marketing Cloud + Sales Cloud','Profile API endpoint for web personalization','Data quality dashboard (match rate, record volume)']
      },
      {
        id:'realtime-segment', title:'Real-Time Behavioral Segmentation Engine',
        overview:'Build a real-time segmentation engine that reacts to customer behavior (browse, purchase, abandon, support contact) as it happens — immediately updating segment membership and triggering relevant experiences across channels without batch delays.',
        duration:'5–6 weeks', difficulty:'Advanced', teamSize:'2 Developers',
        techStack:['Data Cloud Streaming Ingestion','Streaming Insights','Real-time Segment Refresh','Interaction Studio / Personalization','Event-triggered Journeys in MC','Web SDK + Mobile SDK','Data Cloud APIs'],
        steps:[
          {title:'Implement Streaming Event Ingestion', detail:'Deploy Data Cloud Web SDK on website (track page views, product views, add-to-cart, checkout events). Deploy Mobile SDK for app behavior. Set up Streaming Data Stream for website events → Data Cloud. Define Event schema: CustomerID, EventType, ProductID, CategoryID, Timestamp, SessionID, Channel.'},
          {title:'Build Real-Time Calculated Insights', detail:'Create streaming Calculated Insights with real-time update: Browse_Count_24h (count page views last 24hrs), Cart_Abandonment_Flag (add-to-cart + no purchase last 4hrs), Category_Interest_Score (weighted views/clicks by category), Re-engagement_Signal (returning visitor after 30+ day absence).'},
          {title:'Configure Real-Time Segments', detail:'Create segments with real-time refresh: Browse Abandoner (viewed product 2+ times, no purchase, last 24hrs), Cart Abandoner (cart_abandonment_flag = true, last 4hrs), Category Enthusiast (category interest score > 70 for a single category), Returning High Value (re-engagement + LTV > $1,000).'},
          {title:'Configure Event-Triggered Journeys', detail:'Create MC Journey triggered by Data Cloud segment membership change: Cart Abandoner → Trigger email in <15 minutes (while still considering). Browse Abandoner → Trigger browse retargeting ad in 30 minutes. Category Enthusiast → Trigger product recommendation push notification.'},
          {title:'Website Real-Time Personalization', detail:'Use Interaction Studio (Personalization) with Data Cloud as profile source. Configure real-time web experiences: show relevant category banner based on Category_Interest_Score, highlight products similar to browsed items, show loyalty points widget for High Value segment, display urgency messaging for Cart Abandoners.'},
          {title:'Measure Latency & Performance', detail:'Build Data Cloud latency monitoring: measure event ingestion → segment update → activation time. Target < 5 minutes for cart abandonment trigger. Track lift in conversion from real-time vs batch audiences. Build executive dashboard: Real-time segment membership, trigger volume by type, conversion rates.'}
        ],
        approach:'Real-time segmentation is only as fast as your slowest link. Map out the full latency chain (event → ingest → calculate → segment refresh → activation) before committing to SLAs. Start with higher-latency triggers (30-60 min) and tighten based on infrastructure performance.',
        architecture:[
          {layer:'Event Collection', detail:'Web SDK + Mobile SDK → Streaming API'},
          {layer:'Real-time Processing', detail:'Streaming Calculated Insights'},
          {layer:'Segmentation', detail:'Real-time refreshing segments'},
          {layer:'Activation', detail:'MC Event-triggered Journeys + Interaction Studio'},
          {layer:'Personalization', detail:'Web/App real-time experience engine'}
        ],
        deliverables:['Web SDK deployed collecting 5+ event types','Mobile SDK events integrated','4 streaming Calculated Insights','5 real-time segments (< 5 min refresh)','Event-triggered MC journey for cart abandonment','Interaction Studio web personalization (3 experiences)','Latency monitoring dashboard']
      },
      {
        id:'churn-prediction', title:'Predictive Churn Analysis & Intervention',
        overview:'Build an end-to-end churn prediction system using Einstein Studio in Data Cloud — train a custom ML model on unified customer data, score the entire customer base weekly, and trigger proactive retention interventions for at-risk accounts.',
        duration:'6–8 weeks', difficulty:'Advanced', teamSize:'2–3 Developers/Data Scientists',
        techStack:['Data Cloud','Einstein Studio (BYOM or Auto ML)','Calculated Insights as features','Tableau for model monitoring','Segment Builder','Activation to Sales + MC','Apex for CRM integration','A/B testing framework'],
        steps:[
          {title:'Define Churn & Build Training Dataset', detail:'Define "churned" with business stakeholders (subscription cancelled, no purchase in 180 days, account closed). Pull 24 months of historical data: customer demographics, purchase history, support interactions, email engagement, product usage. Create labeled dataset (churned = 1, active = 0) with 12-month prediction window.'},
          {title:'Feature Engineering in Data Cloud', detail:'Create Calculated Insights as ML features: Purchase_Frequency_Decline (% change last 90 vs prev 90 days), Support_Escalations_90d, Days_Since_Last_Login, Contract_Days_to_Renewal, Competitor_Mention_Count (from support notes), NPS_Score, Email_Engagement_Trend (improving/declining/flat).'},
          {title:'Train Model in Einstein Studio', detail:'Use Einstein Studio Auto ML to train churn prediction model on labeled dataset. Evaluate model performance: AUC > 0.80, Precision > 70%, Recall > 65%. Review feature importance (top predictors). Retrain quarterly with fresh data. Document model card (performance, fairness, limitations).'},
          {title:'Deploy Scoring Pipeline', detail:'Create Activation to Einstein Studio: score full active customer base weekly. Store Churn_Probability__c score and Churn_Risk_Tier (Low/Medium/High/Critical) as Calculated Insights. Build score trending chart (is risk increasing?). Flag accounts where risk jumped > 20 points in 1 week.'},
          {title:'Build Intervention Workflows', detail:'Create segmented interventions: Critical Risk (>80%) → Assign to Account Executive, create high-priority Opportunity (Renewal), trigger executive outreach. High Risk (60-80%) → Success Manager quarterly business review. Medium Risk (40-60%) → Automated nurture campaign with value reinforcement content.'},
          {title:'A/B Test Interventions & Measure Lift', detail:'Randomly assign 50% of High Risk accounts to intervention group, 50% to holdout control. Measure 90-day churn rate in each group. Calculate revenue retention lift. Use results to calibrate intervention thresholds and update the model training labels with true churn outcomes.'}
        ],
        approach:'Churn models are only useful if the interventions they trigger are actually executed. Pair every risk tier with a concrete, executable playbook. Avoid over-engineering the model — a simple logistic regression with good features often outperforms complex deep learning for B2B churn.',
        architecture:[
          {layer:'Feature Store', detail:'Data Cloud Calculated Insights (8+ features)'},
          {layer:'ML Layer', detail:'Einstein Studio Auto ML / BYOM'},
          {layer:'Scoring Pipeline', detail:'Weekly batch scoring + real-time for new customers'},
          {layer:'Intervention', detail:'Segmented playbooks by risk tier'},
          {layer:'Measurement', detail:'A/B holdout + retention lift tracking'}
        ],
        deliverables:['Labeled training dataset (24 months of history)','8+ ML features as Calculated Insights','Trained churn model (AUC > 0.80)','Weekly scoring pipeline','Churn score field on Customer profile','3-tier intervention workflows (Critical/High/Medium)','A/B test framework for intervention measurement','Quarterly model retraining pipeline']
      }
    ]
  },

  experienceCloud: {
    id:'experienceCloud', title:'Experience Cloud', icon:'🌐', color:'#7B5EA7', darkColor:'#3B2F5C',
    desc:'Build branded digital experiences — partner portals, customer communities, and employee hubs.',
    tags:['Partner Portal','Customer Community','LWC Components','Guest Users','CMS','Personalization'],
    projects:[
      {
        id:'partner-portal', title:'Partner Portal with Deal Registration & MDF',
        overview:'Build a partner portal enabling channel partners to register deals, request Marketing Development Funds (MDF), access sales enablement content, track their pipeline, and collaborate with the internal partner success team — all through a branded Experience Cloud site.',
        duration:'6–8 weeks', difficulty:'Intermediate', teamSize:'2–3 Developers',
        techStack:['Experience Cloud (Partner Community)','LWC Custom Components','Partner Relationship Management','Deal Registration Flows','MDF Claims & Approval','CMS Content','Salesforce CRM Integration','Reporting for Partners'],
        steps:[
          {title:'Configure Partner Community & Licensing', detail:'Enable Experience Cloud. Create new site using Partner Central template. Configure partner user licenses and partner account hierarchy. Set up Partner Portal Profile with appropriate permissions. Create Partner Roles (Gold, Silver, Bronze) with tiered access and benefits.'},
          {title:'Build Deal Registration Module', detail:'Create Deal_Registration__c custom object with fields: Partner, End Customer, Opportunity Amount, Product Interest, Competition, Expected Close. Build Deal Registration Flow (guided wizard using LWC + Flows). Configure approval: auto-register if no conflict, flag conflicts to Partner Manager. Add deal expiration (90-day window).'},
          {title:'Implement Partner Pipeline View', detail:'Build LWC partnerPipeline component showing: active registrations, deal status (Registered → Approved → Active Opp → Won/Lost), monthly pipeline chart, win rate by product. Wire to custom Apex controller with proper sharing rules (partners see only their own deals). Add export to Excel functionality.'},
          {title:'Build MDF Request Module', detail:'Create MDF_Request__c object (Budget_Period, Activity_Type, Requested_Amount, Justification, Expected_ROI, Status, Actual_Spend). Build MDF Request Form in Flow with document attachment. Configure multi-level approval (Partner Manager → Finance). Build MDF balance tracker showing available vs. committed funds.'},
          {title:'Configure Sales Enablement CMS', detail:'Create CMS workspace for partner content (branded as partner portal). Organize by category: Product Datasheets, Battle Cards, Demo Videos, Case Studies, Training Materials. Apply audience-based visibility (Gold partners see advanced content). Enable search across all content types.'},
          {title:'Build Partner Onboarding Journey', detail:'Create automated onboarding for new partners (triggered when Partner Account is created): Week 1 (portal access email + Getting Started guide), Week 2 (product training reminder), Week 4 (first deal registration reminder), Week 8 (partner success check-in task for internal team). Use Marketing Cloud or Flow for orchestration.'}
        ],
        approach:'Partners value self-service above all — design the portal so they never have to email someone for status. Apply record-level security rigorously (partners must never see other partners\' deals). Start with deal registration and pipeline visibility, then add MDF and content in phase 2.',
        architecture:[
          {layer:'Community Layer', detail:'Experience Cloud Partner Central template + branding'},
          {layer:'Deal Management', detail:'Deal Registration object + Flows + Approval'},
          {layer:'Visibility', detail:'LWC Pipeline Dashboard + sharing rules'},
          {layer:'Incentives', detail:'MDF Request + Budget tracking'},
          {layer:'Content', detail:'CMS + audience-based visibility'},
          {layer:'Onboarding', detail:'Automated partner onboarding journey'}
        ],
        deliverables:['Experience Cloud Partner portal (branded)','Deal Registration module with conflict detection','LWC Partner Pipeline Dashboard','MDF Request + Approval workflow','CMS with 20+ pieces of sales content','Partner onboarding automation (8-week)','Partner performance scorecard (Dashboard)']
      },
      {
        id:'self-service-portal', title:'Customer Self-Service Portal with AI Chatbot',
        overview:'Build a customer self-service portal that reduces support volume by enabling customers to find answers, submit cases, track status, manage their account, and get instant answers from an Einstein Bot — all without contacting an agent.',
        duration:'5–7 weeks', difficulty:'Intermediate', teamSize:'2–3 Developers',
        techStack:['Experience Cloud (Customer Service template)','Einstein Bot (AI chatbot)','Knowledge Base','Case Portal','LWC Custom Components','Embedded Chat','Flow for guided troubleshooting','Analytics for deflection tracking'],
        steps:[
          {title:'Configure Customer Portal Site', detail:'Create site using Customer Service template. Configure login with SSO (Okta/Azure AD) or site-specific credentials. Set Guest User permissions (read Knowledge only). Authenticated user permissions (read cases, create cases, update contact info). Apply brand kit (logo, colors, fonts, domain).'},
          {title:'Integrate Knowledge Base', detail:'Configure Knowledge component with filtered search (by product, article type). Enable Related Articles on case submission form. Add article feedback widgets (helpful/not helpful). Display article view count and last-updated date. Show "Did this resolve your issue?" CTA after each article.'},
          {title:'Build Case Portal', detail:'Create Case_Portal LWC: case list with status filter + search, case detail with timeline, ability to add comments/attachments, close case button, reopen case button. Link to related Knowledge Articles. Show SLA countdown for open cases. Enable Email notification on case status change.'},
          {title:'Build Einstein Bot', detail:'Create Einstein Bot for common support topics: Password Reset (guided flow), Order Status (API lookup), Return Request (form filling), Billing Questions (FAQ), Technical Troubleshooting (decision tree). Set intent detection for top-10 inquiry types. Configure human escalation when bot confidence < 60%.'},
          {title:'Implement Guided Troubleshooting Flow', detail:'Create interactive troubleshooting wizards for common issues using Experience Cloud Flows. Example: "My device won\'t connect" → 5-step diagnostic flow with branch logic → shows relevant Knowledge Articles at each step → creates pre-filled Case if unresolved. Track completion rate and resolution rate per troubleshooter.'},
          {title:'Measure & Optimize Deflection', detail:'Instrument all self-service interactions: article views before case creation, bot sessions with resolution, troubleshooter completions, case creation rate per session. Build Deflection Dashboard: sessions resolved without case (%), top deflected intents, articles with lowest resolution rate (need improvement). Set target: 35% case deflection rate.'}
        ],
        approach:'Einstein Bot quality = intent training data quality. Don\'t launch the bot until you have 50+ utterances per intent. Prioritize the highest-volume inquiry types (often password reset, order status) — deflecting these creates immediate measurable ROI. Gate bot escalation to human agents carefully to avoid frustrating customers.',
        architecture:[
          {layer:'Portal', detail:'Experience Cloud + SSO + branded theme'},
          {layer:'Knowledge', detail:'Salesforce Knowledge + filtered search'},
          {layer:'Case Management', detail:'LWC Case Portal + status tracking'},
          {layer:'AI Bot', detail:'Einstein Bot + human escalation'},
          {layer:'Guided Resolution', detail:'Flow-based troubleshooters'},
          {layer:'Analytics', detail:'Deflection metrics + article performance'}
        ],
        deliverables:['Branded Customer Portal with SSO','Knowledge Base with article feedback','LWC Case Portal (list + detail + timeline)','Einstein Bot handling 10 intents','3 guided troubleshooting flows','Deflection rate dashboard','Mobile-responsive design + accessibility (WCAG 2.1 AA)']
      }
    ]
  },

  financialServices: {
    id:'financialServices', title:'Financial Services Cloud', icon:'💰', color:'#00A1E0', darkColor:'#0A3045',
    desc:'Build compliant, relationship-driven financial solutions for banking, wealth management, and insurance.',
    tags:['Wealth Management','Loan Origination','KYC/AML','Insurance','Client Portal','OmniStudio'],
    projects:[
      {
        id:'wealth-management', title:'Wealth Management Client Portal & Advisor Console',
        overview:'Build a comprehensive wealth management platform: a client-facing portal showing portfolio holdings, performance, goals, and advisor messages, paired with an advisor console for relationship management, household planning, and compliant communication.',
        duration:'8–10 weeks', difficulty:'Advanced', teamSize:'3–4 Developers',
        techStack:['Financial Services Cloud (FSC)','Experience Cloud (Client Portal)','OmniStudio FlexCards','Portfolio Aggregation API','LWC Custom Charts','Interaction Log','Document Vault','Compliant Communication (Messaging Studio)','CRM Analytics'],
        steps:[
          {title:'Configure FSC Data Model', detail:'Enable Financial Services Cloud. Configure the FSC data model: Individual (client as Person Account), Financial Account (brokerage, IRA, 401k, trust), Financial Account Holding (positions), Financial Goal (retirement, education, major purchase), Household (multiple clients grouped). Set up Relationship Groups.'},
          {title:'Build Portfolio Integration', detail:'Create Apex integration service to connect to custodian data feeds (Schwab, Fidelity, or via Orion/Black Diamond aggregation API). Map portfolio data to FSC Financial Account Holdings. Schedule nightly batch for positions and transactions sync. Enable real-time price updates via streaming API (market hours only).'},
          {title:'Build Client Portal in Experience Cloud', detail:'Create branded Experience Cloud portal for wealth clients. Build Portfolio Overview FlexCard (total assets, asset allocation donut chart, performance chart). Holdings table with sort/filter. Transaction history view. Goal progress tracker (current vs. target with projected date). Secure document vault (statements, tax docs).'},
          {title:'Build Advisor Household Console', detail:'Create advisor FSC console customization: Household overview (all family members + accounts), Relationship map visualization, Life Events tracker (birth, marriage, retirement), KYC/AML compliance score, Next Best Action suggestions (Einstein Recommendations), Recent activity timeline. Add prospect pipeline view.'},
          {title:'Implement Compliant Communication', detail:'Build Compliant Communication workflow: Advisors compose messages in Salesforce → auto-archive to Interaction Log → client notified via portal + email → client replies in portal → archived. Meet FINRA/SEC archival requirements. Build audit trail report. Integrate with Smarsh or Global Relay for compliance archival.'},
          {title:'Build Client Goals & Planning Module', detail:'Create Goals planning tool: client sets goal (retire at 65 with $2M), advisor inputs current savings + contribution rate + risk tolerance → LWC projection calculator shows probability of success + recommendations. Store scenarios. Generate planning summary PDF for advisor-client review meeting.'}
        ],
        approach:'Compliance is non-negotiable in FSC projects. Every communication must be archivable; every recommendation must be logged. Use the FSC standard data model rather than building custom objects — it\'s pre-built for regulatory compliance and FINRA requirements. Focus on the advisor experience first; the client portal is a differentiator but the advisor console drives adoption.',
        architecture:[
          {layer:'Data Model', detail:'FSC standard model (Individual, Financial Account, Holdings)'},
          {layer:'Integration', detail:'Custodian API for portfolio data (nightly + real-time prices)'},
          {layer:'Client Portal', detail:'Experience Cloud + FlexCards + Portfolio charts'},
          {layer:'Advisor Console', detail:'FSC Console + Household view + Life Events'},
          {layer:'Compliance', detail:'Interaction Log + Communication archival'},
          {layer:'Planning', detail:'Goals + Projection calculator + PDF report'}
        ],
        deliverables:['FSC configured with Household + Financial Account model','Custodian portfolio data integration (nightly sync)','Client Portal with portfolio + goals dashboard','Advisor Household Console with relationship map','Compliant Communication with archival','Financial Goals projection calculator','CRM Analytics AUM and household growth dashboard','FINRA compliance documentation']
      },
      {
        id:'loan-origination', title:'Loan Origination & Underwriting System',
        overview:'Build an end-to-end digital loan origination system using FSC and OmniStudio — from online application through credit assessment, document collection, underwriting decision, approval workflow, and loan closing — with a borrower self-service portal.',
        duration:'10–14 weeks', difficulty:'Advanced', teamSize:'3–4 Developers',
        techStack:['Financial Services Cloud','OmniStudio (OmniScript + FlexCards)','Apex for Credit Bureau API','DocuSign for eSign','Flow for approval workflow','Experience Cloud (Borrower Portal)','Document Generation','LWC Decision Dashboard'],
        steps:[
          {title:'Build Loan Application OmniScript', detail:'Create multi-step digital loan application using OmniScript: Section 1 (Personal info + SSN), Section 2 (Employment + income), Section 3 (Assets + liabilities), Section 4 (Property info for mortgage), Section 5 (Loan details + purpose), Section 6 (Consent + disclosures). Save progress between sessions. Pre-fill from authenticated borrower profile.'},
          {title:'Credit Bureau Integration', detail:'Build Apex CreditBureauService integrating with Equifax/Experian/TransUnion APIs (or sandbox mock). Pull credit score, tradelines, derogatory marks, and credit inquiries. Store Credit_Pull__c records with pull date, bureau, score, and report XML. Implement FCRA consent capture and adverse action notice generation.'},
          {title:'Automated Underwriting Rules Engine', detail:'Create Underwriting_Rule__mdt Custom Metadata records for configurable decision rules (DTI < 43%, LTV < 80%, credit score > 620 for conventional). Build Apex UnderwritingService evaluating all rules against application data. Output: Auto-Approve (all rules pass), Refer (within guidelines), Auto-Decline (hard fails). Store decision rationale.'},
          {title:'Build Document Collection Portal', detail:'Create borrower portal (Experience Cloud) for secure document upload: pay stubs, bank statements, W2s, tax returns, ID verification. Build Document Checklist LWC showing required vs. uploaded vs. verified status. Notify underwriter when all documents received. Enable document request (underwriter requests additional docs from borrower).'},
          {title:'Underwriter Decision Dashboard', detail:'Build LWC Underwriting Console: loan application summary, credit report viewer (parsed tradelines, score factors), DTI/LTV ratio calculators, collateral/appraisal section, condition issuance tool (issue conditions for conditional approval), final decision buttons (Approve/Decline/Counter-offer). Log all conditions and decisions with timestamp + user.'},
          {title:'Loan Closing & Disbursement', detail:'Generate Loan Documents package (Promissory Note, Deed of Trust, Closing Disclosure) using Document Generation. Route to borrower for DocuSign e-signature. Calculate closing costs and fee schedule. Trigger disbursement record on completed signatures. Update Loan Status to Booked. Create first payment notice.'}
        ],
        approach:'Digital lending projects live or die on the borrower experience. A borrower who abandons the application halfway is a lost loan. Design for mobile-first, auto-save, and minimal re-entry of data. The underwriting rules engine should be separate from the application process — loan officers need to adjust criteria without code changes (hence Custom Metadata).',
        architecture:[
          {layer:'Application', detail:'OmniScript multi-section digital application'},
          {layer:'Credit', detail:'Credit Bureau API + FCRA-compliant storage'},
          {layer:'Underwriting', detail:'Rules Engine (Custom Metadata) + Apex service'},
          {layer:'Documents', detail:'Borrower Portal upload + Document Generation + DocuSign'},
          {layer:'Decision', detail:'LWC Underwriting Console + condition management'},
          {layer:'Closing', detail:'Loan document generation + e-sign + disbursement record'}
        ],
        deliverables:['OmniScript 6-section digital loan application','Credit bureau API integration (score + tradelines)','Underwriting Rules Engine (10+ configurable rules)','Borrower document portal with checklist','LWC Underwriter Console with DTI/LTV calculators','Loan document generation + DocuSign integration','Auto Approve/Refer/Decline logic with audit trail','Loan pipeline dashboard for managers']
      }
    ]
  }
};
