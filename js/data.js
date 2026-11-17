// LocalLance demo data.
// Every person, business, job, review and payment in this file is fictitious.
// It is loaded with a <script> tag (not fetch) so the site works when opened straight from a folder.

const LL_SERVICES = [
  { id: 'web', name: 'Web and app development', blurb: 'Websites, online stores and small apps.', from: 400, icon: 'code' },
  { id: 'design', name: 'Graphic design and branding', blurb: 'Logos, menus, signage and brand kits.', from: 150, icon: 'pen' },
  { id: 'it', name: 'IT support and networking', blurb: 'Setup, repairs, Wi-Fi and backups.', from: 120, icon: 'wifi' },
  { id: 'marketing', name: 'Digital marketing and social media', blurb: 'Ads, search ranking and content calendars.', from: 200, icon: 'megaphone' },
  { id: 'writing', name: 'Writing and content', blurb: 'Web copy, blogs and product descriptions.', from: 100, icon: 'text' },
  { id: 'books', name: 'Bookkeeping and admin', blurb: 'Invoices, BAS preparation and data entry.', from: 150, icon: 'calc' }
];

// Suburb positions (latitude, longitude), used for distances and the freelancer map.
const LL_SUBURBS = {
  'Melbourne CBD': [-37.8136, 144.9631],
  'Footscray': [-37.7996, 144.8994],
  'Brunswick': [-37.7667, 144.9600],
  'Sunshine': [-37.7880, 144.8320],
  'Richmond': [-37.8183, 144.9980],
  'St Kilda': [-37.8676, 144.9809],
  'Carlton': [-37.8001, 144.9671],
  'Fitzroy': [-37.7984, 144.9780],
  'Preston': [-37.7420, 145.0000],
  'Coburg': [-37.7430, 144.9640],
  'Werribee': [-37.9000, 144.6600],
  'Box Hill': [-37.8190, 145.1220],
  'Essendon': [-37.7490, 144.9120],
  'Williamstown': [-37.8640, 144.8990]
};

const LL_CONTACT = {
  company: 'LocalLance Pty Ltd',
  abn: '00 000 000 000',
  acn: '000 000 000',
  address: 'Level 1, 100 Example Street, Footscray VIC 3011',
  phone: '(03) 0000 0000',
  email: 'asklocal@locallance.com.au',
  mapQuery: 'Footscray VIC 3011, Australia'
};

const LL_SEED = {
  sessionUserId: null,

  users: [
    // Customers (small businesses)
    { id: 'c1', role: 'customer', name: 'Sofia Rossi', business: "Rossi's Cafe", email: 'sofia@rossiscafe.example', suburb: 'Footscray', joined: '2026-08-02' },
    { id: 'c2', role: 'customer', name: 'Daniel Nguyen', business: 'Nguyen Plumbing', email: 'daniel@nguyenplumbing.example', suburb: 'Sunshine', joined: '2026-08-19' },
    { id: 'c3', role: 'customer', name: 'Priya Sharma', business: 'Bloom Florist', email: 'priya@bloomflorist.example', suburb: 'Brunswick', joined: '2026-09-01' },
    { id: 'c4', role: 'customer', name: 'Tom Walker', business: 'Walker Fitness Studio', email: 'tom@walkerfitness.example', suburb: 'Richmond', joined: '2026-09-14' },
    { id: 'c5', role: 'customer', name: 'Hannah Lee', business: 'Lee and Co Accounting', email: 'hannah@leeandco.example', suburb: 'Carlton', joined: '2026-07-22' },
    { id: 'c6', role: 'customer', name: 'Marco Silva', business: 'Silva Auto Repairs', email: 'marco@silvaauto.example', suburb: 'Preston', joined: '2026-10-03' },

    // Freelancers
    { id: 'f1', role: 'freelancer', name: 'Mia Tran', title: 'Web developer', category: 'web', email: 'mia@example.com', suburb: 'Footscray', abn: '00 000 000 101', abnVerified: true, rate: 65, rating: 4.9, jobsDone: 38, promoted: true, skills: ['WordPress', 'Shopify', 'HTML and CSS', 'JavaScript'], bio: 'I build fast, simple websites and online stores for cafes, shops and trades across the inner west.', joined: '2026-07-10' },
    { id: 'f2', role: 'freelancer', name: "Liam O'Connor", title: 'Graphic designer', category: 'design', email: 'liam@example.com', suburb: 'Brunswick', abn: '00 000 000 102', abnVerified: true, rate: 55, rating: 4.8, jobsDone: 24, promoted: true, skills: ['Logos', 'Menus', 'Signage', 'Print'], bio: 'Brand and print designer. I make logos, menus and shopfront signage that look good and print right the first time.', joined: '2026-07-18' },
    { id: 'f3', role: 'freelancer', name: 'Aisha Khan', title: 'Bookkeeper', category: 'books', email: 'aisha@example.com', suburb: 'Sunshine', abn: '00 000 000 103', abnVerified: true, rate: 50, rating: 5.0, jobsDone: 17, promoted: false, skills: ['Xero', 'BAS preparation', 'Payroll', 'Invoicing'], bio: 'Registered bookkeeper for sole traders and small teams. Tidy books, on-time BAS and no surprises.', joined: '2026-07-25' },
    { id: 'f4', role: 'freelancer', name: 'Jack Thompson', title: 'IT support technician', category: 'it', email: 'jack@example.com', suburb: 'Essendon', abn: '00 000 000 104', abnVerified: true, rate: 60, rating: 4.7, jobsDone: 41, promoted: false, skills: ['Wi-Fi', 'Backups', 'Point of sale', 'Printers'], bio: 'On-site IT help for offices and shops. I fix the Wi-Fi, set up backups and explain it in plain English.', joined: '2026-07-12' },
    { id: 'f5', role: 'freelancer', name: 'Chloe Martin', title: 'Social media marketer', category: 'marketing', email: 'chloe@example.com', suburb: 'St Kilda', abn: '00 000 000 105', abnVerified: true, rate: 48, rating: 4.6, jobsDone: 19, promoted: false, skills: ['Instagram', 'Facebook ads', 'Content calendars'], bio: 'I plan and post content for local businesses, and run small ad campaigns that bring people through the door.', joined: '2026-08-05' },
    { id: 'f6', role: 'freelancer', name: 'Ravi Patel', title: 'App developer', category: 'web', email: 'ravi@example.com', suburb: 'Carlton', abn: '00 000 000 106', abnVerified: true, rate: 80, rating: 4.9, jobsDone: 12, promoted: true, skills: ['Booking systems', 'React', 'Payments', 'APIs'], bio: 'Software engineer building booking systems and small web apps for service businesses.', joined: '2026-08-11' },
    { id: 'f7', role: 'freelancer', name: 'Emily Chen', title: 'Copywriter', category: 'writing', email: 'emily@example.com', suburb: 'Fitzroy', abn: '00 000 000 107', abnVerified: true, rate: 45, rating: 4.8, jobsDone: 27, promoted: false, skills: ['Website copy', 'Blogs', 'Product descriptions'], bio: 'Clear, friendly words for websites and menus. I write the way your customers talk.', joined: '2026-08-15' },
    { id: 'f8', role: 'freelancer', name: 'Noah Williams', title: 'Network engineer', category: 'it', email: 'noah@example.com', suburb: 'Box Hill', abn: '00 000 000 108', abnVerified: true, rate: 70, rating: 4.5, jobsDone: 9, promoted: false, skills: ['Networking', 'Security cameras', 'Cloud backup'], bio: 'Networks, cabling and cloud backup for offices of up to 20 people.', joined: '2026-09-02' },
    { id: 'f9', role: 'freelancer', name: 'Zoe Papadopoulos', title: 'Brand designer', category: 'design', email: 'zoe@example.com', suburb: 'Richmond', abn: '00 000 000 109', abnVerified: true, rate: 60, rating: 4.7, jobsDone: 15, promoted: false, skills: ['Brand kits', 'Packaging', 'Social templates'], bio: 'I help new businesses look established from day one, with a brand kit you can use everywhere.', joined: '2026-09-09' },
    { id: 'f10', role: 'freelancer', name: 'Omar Haddad', title: 'SEO specialist', category: 'marketing', email: 'omar@example.com', suburb: 'Coburg', abn: '00 000 000 110', abnVerified: true, rate: 52, rating: 4.4, jobsDone: 8, promoted: false, skills: ['Local SEO', 'Google Business Profile', 'Analytics'], bio: 'I get local businesses found on Google Maps and search, with a monthly report you can actually read.', joined: '2026-09-20' },
    { id: 'f11', role: 'freelancer', name: 'Grace Kim', title: 'Virtual assistant', category: 'books', email: 'grace@example.com', suburb: 'Preston', abn: '00 000 000 111', abnVerified: true, rate: 38, rating: 4.9, jobsDone: 33, promoted: false, skills: ['Data entry', 'Inbox management', 'Invoicing'], bio: 'Reliable admin support: inboxes, invoices, bookings and data entry, so you can get on with the work.', joined: '2026-08-01' },
    { id: 'f12', role: 'freelancer', name: 'Ethan Brown', title: 'Junior web developer', category: 'web', email: 'ethan@example.com', suburb: 'Werribee', abn: '', abnVerified: false, rate: 40, rating: 4.3, jobsDone: 5, promoted: false, skills: ['HTML and CSS', 'JavaScript', 'Landing pages'], bio: 'Final-year IT student building landing pages and small sites at student-friendly rates.', joined: '2026-10-12' }
  ],

  jobs: [
    // Open for proposals
    { id: 'j1', customerId: 'c1', title: 'New website for a family cafe', category: 'web', description: 'We need a simple five-page website with our menu, opening hours, photos and a map. We would like to be able to update the menu ourselves.', budget: 1800, suburb: 'Footscray', onsite: false, deadline: '2026-12-15', postedAt: '2026-11-12', status: 'open' },
    { id: 'j2', customerId: 'c3', title: 'Logo refresh and shopfront signage', category: 'design', description: 'Our logo is ten years old. We want a fresh version plus artwork for a new shopfront sign and delivery van.', budget: 900, suburb: 'Brunswick', onsite: false, deadline: '2026-12-05', postedAt: '2026-11-14', status: 'open' },
    { id: 'j3', customerId: 'c5', title: 'Set up office Wi-Fi and backups', category: 'it', description: 'Six-person office. The Wi-Fi drops out in the back rooms and we have no backups. Needs someone on site for half a day.', budget: 650, suburb: 'Carlton', onsite: true, deadline: '2026-11-28', postedAt: '2026-11-15', status: 'open' },
    { id: 'j4', customerId: 'c2', title: 'Quarterly bookkeeping and BAS preparation', category: 'books', description: 'Looking for a bookkeeper to reconcile our accounts in Xero and prepare the quarterly BAS for our accountant.', budget: 1200, suburb: 'Sunshine', onsite: false, deadline: '2026-12-20', postedAt: '2026-11-10', status: 'open' },
    { id: 'j5', customerId: 'c4', title: 'Instagram content for gym launch', category: 'marketing', description: 'We open a second studio in January. We need four weeks of Instagram posts and stories, plus one small ad campaign.', budget: 750, suburb: 'Richmond', onsite: false, deadline: '2026-12-10', postedAt: '2026-11-16', status: 'open' },
    { id: 'j6', customerId: 'c6', title: 'Website copy for auto repair shop', category: 'writing', description: 'Our website text is out of date. We need new copy for the home, services and about pages, around 800 words in total.', budget: 500, suburb: 'Preston', onsite: false, deadline: '2026-12-01', postedAt: '2026-11-13', status: 'open' },
    { id: 'j7', customerId: 'c2', title: 'Online booking page for plumbing jobs', category: 'web', description: 'Customers should be able to pick a time slot and describe the problem. Bookings need to arrive by email and SMS.', budget: 1400, suburb: 'Sunshine', onsite: false, deadline: '2026-12-18', postedAt: '2026-11-17', status: 'open' },
    { id: 'j8', customerId: 'c6', title: 'Google Business Profile and local SEO', category: 'marketing', description: 'We do not show up when people search for mechanics near Preston. Please fix our Google profile and basic SEO.', budget: 600, suburb: 'Preston', onsite: false, deadline: '2026-12-12', postedAt: '2026-11-11', status: 'open' },

    // Proposal accepted, waiting for the customer to pay
    { id: 'j9', customerId: 'c1', title: 'Point-of-sale tablet setup', category: 'it', description: 'Set up two tablets with our point-of-sale app, connect the receipt printer and train two staff.', budget: 400, suburb: 'Footscray', onsite: true, deadline: '2026-11-25', postedAt: '2026-11-08', status: 'assigned', freelancerId: 'f4', proposalId: 'p15', price: 350 },

    // Paid (money held), work in progress
    { id: 'j10', customerId: 'c3', title: 'Online store for flower deliveries', category: 'web', description: 'A small online store with around 30 products, delivery date picker and card payments.', budget: 2500, suburb: 'Brunswick', onsite: false, deadline: '2026-12-08', postedAt: '2026-10-28', status: 'in_progress', freelancerId: 'f1', proposalId: 'p16', price: 2400 },

    // Delivered, waiting for the customer to approve
    { id: 'j11', customerId: 'c4', title: 'Class timetable flyer design', category: 'design', description: 'A4 flyer and matching Instagram tile showing the new class timetable.', budget: 300, suburb: 'Richmond', onsite: false, deadline: '2026-11-20', postedAt: '2026-11-02', status: 'delivered', freelancerId: 'f2', proposalId: 'p17', price: 300 },

    // Completed
    { id: 'j12', customerId: 'c5', title: 'Quarterly BAS lodgement preparation', category: 'books', description: 'Reconcile the September quarter and prepare the BAS figures.', budget: 450, suburb: 'Carlton', onsite: false, deadline: '2026-10-25', postedAt: '2026-10-05', status: 'completed', freelancerId: 'f3', proposalId: 'p18', price: 450 },
    { id: 'j13', customerId: 'c5', title: 'Fix office network dropouts', category: 'it', description: 'Video calls keep dropping. Find the cause and fix it.', budget: 300, suburb: 'Carlton', onsite: true, deadline: '2026-10-15', postedAt: '2026-10-01', status: 'completed', freelancerId: 'f4', proposalId: 'p19', price: 280 },
    { id: 'j14', customerId: 'c1', title: 'Cafe social media starter pack', category: 'marketing', description: 'Set up our Instagram and Facebook pages and create the first twelve posts.', budget: 550, suburb: 'Footscray', onsite: false, deadline: '2026-10-30', postedAt: '2026-10-10', status: 'completed', freelancerId: 'f5', proposalId: 'p20', price: 520 }
  ],

  proposals: [
    { id: 'p1', jobId: 'j1', freelancerId: 'f1', amount: 1700, days: 14, message: 'I have built sites for three cafes nearby and can set up a menu page you edit yourself. Happy to meet at the cafe.', status: 'pending', createdAt: '2026-11-12' },
    { id: 'p2', jobId: 'j1', freelancerId: 'f6', amount: 2000, days: 10, message: 'I can include online table bookings as part of the build.', status: 'pending', createdAt: '2026-11-13' },
    { id: 'p3', jobId: 'j1', freelancerId: 'f12', amount: 1300, days: 21, message: 'Student rate. I would love to add this to my portfolio and will take extra care.', status: 'pending', createdAt: '2026-11-14' },
    { id: 'p4', jobId: 'j2', freelancerId: 'f2', amount: 850, days: 7, message: 'I am ten minutes away in Brunswick and can supply print-ready files for the sign writer.', status: 'pending', createdAt: '2026-11-14' },
    { id: 'p5', jobId: 'j2', freelancerId: 'f9', amount: 900, days: 6, message: 'Includes a small brand kit with colours and fonts for future use.', status: 'pending', createdAt: '2026-11-15' },
    { id: 'p6', jobId: 'j3', freelancerId: 'f4', amount: 600, days: 2, message: 'I can be on site Thursday morning. Price includes two mesh Wi-Fi points and cloud backup setup.', status: 'pending', createdAt: '2026-11-15' },
    { id: 'p7', jobId: 'j3', freelancerId: 'f8', amount: 650, days: 3, message: 'Full network check, new access points and automated backups with a written handover.', status: 'pending', createdAt: '2026-11-16' },
    { id: 'p8', jobId: 'j4', freelancerId: 'f3', amount: 1150, days: 30, message: 'I work in Xero every day and am five minutes from your depot.', status: 'pending', createdAt: '2026-11-11' },
    { id: 'p9', jobId: 'j4', freelancerId: 'f11', amount: 1000, days: 30, message: 'I can handle the data entry and reconciliation and hand a clean file to your accountant.', status: 'pending', createdAt: '2026-11-12' },
    { id: 'p10', jobId: 'j5', freelancerId: 'f5', amount: 700, days: 10, message: 'I ran the launch campaign for a yoga studio in St Kilda last year and can share the results.', status: 'pending', createdAt: '2026-11-16' },
    { id: 'p11', jobId: 'j6', freelancerId: 'f7', amount: 480, days: 5, message: 'I will visit the workshop for an hour so the copy sounds like you.', status: 'pending', createdAt: '2026-11-14' },
    { id: 'p12', jobId: 'j7', freelancerId: 'f1', amount: 1350, days: 12, message: 'I can build this on your existing site so nothing else changes.', status: 'pending', createdAt: '2026-11-17' },
    { id: 'p13', jobId: 'j8', freelancerId: 'f10', amount: 560, days: 14, message: 'Local SEO is all I do. You will get a before and after report.', status: 'pending', createdAt: '2026-11-12' },
    { id: 'p14', jobId: 'j8', freelancerId: 'f5', amount: 600, days: 10, message: 'I can pair the profile fix with a short reviews campaign.', status: 'pending', createdAt: '2026-11-13' },
    { id: 'p15', jobId: 'j9', freelancerId: 'f4', amount: 350, days: 1, message: 'I know this point-of-sale app well and can do it in one visit.', status: 'accepted', createdAt: '2026-11-09' },
    { id: 'p16', jobId: 'j10', freelancerId: 'f1', amount: 2400, days: 28, message: 'Shopify store with delivery date picker. I will train you to add products.', status: 'accepted', createdAt: '2026-10-29' },
    { id: 'p17', jobId: 'j11', freelancerId: 'f2', amount: 300, days: 4, message: 'Flyer plus matching social tile, two rounds of changes included.', status: 'accepted', createdAt: '2026-11-03' },
    { id: 'p18', jobId: 'j12', freelancerId: 'f3', amount: 450, days: 7, message: 'Happy to take this on each quarter.', status: 'accepted', createdAt: '2026-10-06' },
    { id: 'p19', jobId: 'j13', freelancerId: 'f4', amount: 280, days: 1, message: 'Sounds like a router problem. I can come by tomorrow.', status: 'accepted', createdAt: '2026-10-02' },
    { id: 'p20', jobId: 'j14', freelancerId: 'f5', amount: 520, days: 9, message: 'Includes a simple posting guide for your staff.', status: 'accepted', createdAt: '2026-10-11' }
  ],

  // The platform fee is 8% of the job price, paid by the freelancer. Customers pay no fee.
  payments: [
    { id: 'pay1', jobId: 'j10', amount: 2400, fee: 192, payout: 2208, method: 'PayPal (demo)', status: 'held', paidAt: '2026-10-31', releasedAt: null },
    { id: 'pay2', jobId: 'j11', amount: 300, fee: 24, payout: 276, method: 'PayPal (demo)', status: 'held', paidAt: '2026-11-04', releasedAt: null },
    { id: 'pay3', jobId: 'j12', amount: 450, fee: 36, payout: 414, method: 'PayPal (demo)', status: 'released', paidAt: '2026-10-07', releasedAt: '2026-10-16' },
    { id: 'pay4', jobId: 'j13', amount: 280, fee: 22, payout: 258, method: 'PayPal (demo)', status: 'released', paidAt: '2026-10-03', releasedAt: '2026-10-05' },
    { id: 'pay5', jobId: 'j14', amount: 520, fee: 42, payout: 478, method: 'PayPal (demo)', status: 'released', paidAt: '2026-10-12', releasedAt: '2026-10-24' }
  ],

  reviews: [
    { id: 'r1', jobId: 'j12', fromId: 'c5', toId: 'f3', rating: 5, text: 'Everything reconciled and explained clearly. Our accountant was impressed.', date: '2026-10-16' },
    { id: 'r2', jobId: 'j13', fromId: 'c5', toId: 'f4', rating: 5, text: 'Found a faulty router in twenty minutes. Calls have been perfect since.', date: '2026-10-05' },
    { id: 'r3', jobId: 'j14', fromId: 'c1', toId: 'f5', rating: 4, text: 'Great posts and a handy guide. Took a little longer than planned.', date: '2026-10-24' },
    { id: 'r4', jobId: null, fromId: 'c2', toId: 'f1', rating: 5, text: 'Mia rebuilt our site in two weeks and bookings doubled.', date: '2026-09-18' },
    { id: 'r5', jobId: null, fromId: 'c4', toId: 'f1', rating: 5, text: 'Fast, friendly and local. She came to the studio to take photos herself.', date: '2026-09-30' },
    { id: 'r6', jobId: null, fromId: 'c6', toId: 'f2', rating: 5, text: 'The new sign looks fantastic and the files were ready for the printer.', date: '2026-10-08' },
    { id: 'r7', jobId: null, fromId: 'c3', toId: 'f6', rating: 5, text: 'Ravi built a booking system that just works.', date: '2026-10-20' },
    { id: 'r8', jobId: null, fromId: 'c1', toId: 'f7', rating: 5, text: 'Emily made our menu sound delicious.', date: '2026-09-25' },
    { id: 'r9', jobId: null, fromId: 'c2', toId: 'f11', rating: 5, text: 'Grace keeps our invoices moving. Highly recommended.', date: '2026-10-14' }
  ],

  messages: [
    { id: 'm1', jobId: 'j10', fromId: 'c3', text: 'Hi Mia, payment is in. When can we go through the product list?', at: '2026-10-31 09:12' },
    { id: 'm2', jobId: 'j10', fromId: 'f1', text: 'Thanks Priya! I can drop by the shop on Monday at 10 if that suits.', at: '2026-10-31 09:40' },
    { id: 'm3', jobId: 'j10', fromId: 'c3', text: 'Monday at 10 is perfect. I will have the photos ready.', at: '2026-10-31 10:02' },
    { id: 'm4', jobId: 'j10', fromId: 'f1', text: 'The store is up on a test link with the first 12 products. Have a look when you can.', at: '2026-11-14 16:25' },
    { id: 'm5', jobId: 'j11', fromId: 'f2', text: 'Flyer and Instagram tile are uploaded. Let me know if you want any changes.', at: '2026-11-07 14:03' },
    { id: 'm6', jobId: 'j9', fromId: 'f4', text: 'Thanks for accepting. I can come on Saturday morning once the payment is through.', at: '2026-11-10 11:30' }
  ],

  // Promotions shown around the site (the "ads").
  ads: [
    { id: 'a1', tag: 'For freelancers', title: 'Your first job is fee-free', text: 'New freelancers keep 100% of their first completed job.', cta: 'Join as a freelancer', link: 'login.html' },
    { id: 'a2', tag: 'For customers', title: 'Free job posts, always', text: 'Post a job in two minutes and get proposals from verified locals.', cta: 'Post a job', link: 'post-job.html' },
    { id: 'a3', tag: 'Promoted listings', title: 'Get seen first for $15 a week', text: 'Promoted freelancers appear at the top of search results.', cta: 'Promote my profile', link: 'dashboard.html' },
    { id: 'a4', tag: 'Refer and save', title: 'Refer a business, get $20 credit', text: 'Know a shop that needs a hand? Send them our way.', cta: 'Contact us', link: 'contact.html' }
  ],

  contactMessages: []
};
