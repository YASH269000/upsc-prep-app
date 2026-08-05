import type { ResourceLink } from '../db/db'

// All entries are outbound links only (title + description + URL). No copyrighted
// content is embedded in this app. Distributed across GS papers / subjects.

export const RESOURCES_SEED: ResourceLink[] = [
  // ---- UPSC Official ----
  { title: 'UPSC Official Website', description: 'Notifications, syllabus PDF, exam calendar, previous year question papers.', url: 'https://upsc.gov.in', type: 'official-govt', subject: 'General', paper: 'All Papers', language: 'English/Hindi' },
  { title: 'UPSC Previous Year Papers', description: 'Official archive of Prelims & Mains question papers.', url: 'https://upsc.gov.in/examinations/previous-question-papers', type: 'official-govt', subject: 'General', paper: 'All Papers', language: 'English/Hindi' },

  // ---- NCERT / ePathshala / NIOS ----
  { title: 'NCERT Textbooks (all classes)', description: 'Free official NCERT textbooks for Class 6-12, the base layer for UPSC GS prep.', url: 'https://ncert.nic.in', type: 'text', subject: 'General', paper: 'All Papers', language: 'English/Hindi' },
  { title: 'ePathshala', description: 'NCERT digital platform with textbooks, audio, video and e-content.', url: 'https://epathshala.nic.in', type: 'text', subject: 'General', paper: 'All Papers', language: 'English/Hindi' },
  { title: 'NIOS Study Material', description: 'NIOS Class 11-12 material, useful simplified alternative to NCERT for some subjects.', url: 'https://www.nios.ac.in', type: 'text', subject: 'General', paper: 'All Papers', language: 'English/Hindi' },
  { title: 'NCERT Class 11 Indian Constitution at Work', description: 'Foundational polity textbook covering constitutional design and functioning.', url: 'https://ncert.nic.in', type: 'text', subject: 'Polity', paper: 'Prelims GS I', language: 'English/Hindi' },
  { title: 'NCERT Class 9-10 Contemporary India (Geography)', description: 'Basics of Indian physical, economic and human geography.', url: 'https://ncert.nic.in', type: 'text', subject: 'Geography', paper: 'Prelims GS I', language: 'English/Hindi' },
  { title: 'NCERT Class 11 Indian Economic Development', description: 'Foundational economy textbook: growth, planning, sectors, reforms.', url: 'https://ncert.nic.in', type: 'text', subject: 'Economy', paper: 'Prelims GS I', language: 'English/Hindi' },
  { title: 'NCERT Class 11-12 Themes in Indian History', description: 'Ancient, medieval and modern Indian history themes.', url: 'https://ncert.nic.in', type: 'text', subject: 'History', paper: 'Prelims GS I', language: 'English/Hindi' },
  { title: 'NCERT Class 11 Biology & Class 12 Chemistry (S&T base)', description: 'Base science concepts frequently tested in Prelims GS.', url: 'https://ncert.nic.in', type: 'text', subject: 'Science & Tech', paper: 'Prelims GS I', language: 'English/Hindi' },

  // ---- PIB ----
  { title: 'Press Information Bureau (PIB)', description: 'Official government press releases — the single best current affairs source.', url: 'https://pib.gov.in', type: 'current-affairs', subject: 'Current Affairs', paper: 'All Papers', language: 'English/Hindi' },
  { title: 'PIB Hindi', description: 'Hindi-language government press releases.', url: 'https://pib.gov.in/AllReleasem.aspx?MenuId=3&reg=3&lang=2', type: 'current-affairs', subject: 'Current Affairs', paper: 'All Papers', language: 'Hindi' },

  // ---- PRS Legislative Research ----
  { title: 'PRS Legislative Research', description: 'Bill summaries, legislative analysis, budget analysis (CC BY 4.0 licensed).', url: 'https://prsindia.org', type: 'text', subject: 'Polity', paper: 'Mains GS II', language: 'English' },
  { title: 'PRS Budget Analysis', description: 'Ministry-wise analysis of the Union Budget.', url: 'https://prsindia.org/budgets', type: 'text', subject: 'Economy', paper: 'Mains GS III', language: 'English' },
  { title: 'PRS Bill Track', description: 'Track status and summaries of Bills introduced in Parliament.', url: 'https://prsindia.org/billtrack', type: 'text', subject: 'Polity', paper: 'Mains GS II', language: 'English' },

  // ---- Economic Survey / Budget ----
  { title: 'India Budget Portal', description: 'Union Budget documents and Economic Survey — key source for GS III economy.', url: 'https://www.indiabudget.gov.in', type: 'official-govt', subject: 'Economy', paper: 'Mains GS III', language: 'English/Hindi' },
  { title: 'Economic Survey of India', description: 'Annual flagship document analyzing the state of the Indian economy.', url: 'https://www.indiabudget.gov.in/economicsurvey/', type: 'official-govt', subject: 'Economy', paper: 'Mains GS III', language: 'English/Hindi' },

  // ---- India Code ----
  { title: 'India Code', description: 'Official repository of all Central and State Acts — for reading bare acts.', url: 'https://www.indiacode.nic.in', type: 'official-govt', subject: 'Polity', paper: 'Mains GS II', language: 'English' },
  { title: 'The Constitution of India (bare act)', description: 'Full official text of the Constitution.', url: 'https://www.indiacode.nic.in/handle/123456789/15240', type: 'official-govt', subject: 'Polity', paper: 'Prelims GS I', language: 'English/Hindi' },

  // ---- ARC Reports ----
  { title: '2nd Administrative Reforms Commission Reports', description: 'ARC reports on governance reforms — vital for GS II & Ethics answers.', url: 'https://darpg.gov.in', type: 'official-govt', subject: 'Governance', paper: 'Mains GS II', language: 'English' },

  // ---- SWAYAM / NPTEL ----
  { title: 'SWAYAM', description: 'Free government MOOC platform with university-level courses across subjects.', url: 'https://swayam.gov.in', type: 'video', subject: 'General', paper: 'All Papers', language: 'English/Hindi' },
  { title: 'NPTEL', description: 'IIT/IISc video lecture courses; useful for Science & Tech and Economics optional depth.', url: 'https://nptel.ac.in', type: 'video', subject: 'Science & Tech', paper: 'Mains GS III', language: 'English' },

  // ---- NDLI ----
  { title: 'National Digital Library of India (NDLI)', description: 'Aggregated free access to textbooks, articles and educational content.', url: 'https://ndl.gov.in', type: 'text', subject: 'General', paper: 'All Papers', language: 'English/Hindi' },

  // ---- IGNOU eGyanKosh ----
  { title: 'IGNOU eGyanKosh (personal read only)', description: 'IGNOU study material PDFs — Public Administration, Sociology, Political Science notes.', url: 'https://egyankosh.ac.in', type: 'text', subject: 'Optional Subjects', paper: 'Optional', language: 'English/Hindi' },

  // ---- Sansad TV ----
  { title: 'Sansad TV (YouTube)', description: 'Parliament proceedings, "Perspective" and "Big Picture" debate shows — excellent for GS II/III depth.', url: 'https://www.youtube.com/@sansadtv', type: 'video', subject: 'Polity', paper: 'Mains GS II', language: 'English/Hindi' },
  { title: 'Sansad TV Perspective', description: 'Daily discussion show on current policy issues, search on Sansad TV channel.', url: 'https://www.youtube.com/@sansadtv', type: 'video', subject: 'Current Affairs', paper: 'All Papers', language: 'English/Hindi' },

  // ---- AIR NewsOnAir ----
  { title: 'AIR NewsOnAir', description: 'All India Radio news bulletins and "Spotlight"/"Public Speak" discussions.', url: 'https://newsonair.gov.in', type: 'audio', subject: 'Current Affairs', paper: 'All Papers', language: 'English/Hindi' },

  // ---- Drishti IAS ----
  { title: 'Drishti IAS (free resources)', description: 'Daily current affairs, mains answer writing practice, free articles.', url: 'https://www.drishtiias.com', type: 'text', subject: 'Current Affairs', paper: 'All Papers', language: 'English/Hindi' },
  { title: 'Drishti IAS (YouTube)', description: 'Free daily video lectures on current affairs and GS topics — search "Drishti IAS".', url: 'https://www.youtube.com/results?search_query=Drishti+IAS', type: 'video', subject: 'Current Affairs', paper: 'All Papers', language: 'Hindi' },

  // ---- Vision IAS ----
  { title: 'Vision IAS (free resources)', description: 'Free value-added material and monthly current affairs magazines.', url: 'https://www.visionias.in', type: 'text', subject: 'Current Affairs', paper: 'All Papers', language: 'English' },
  { title: 'Vision IAS (YouTube)', description: 'Free lectures and analysis videos — search "Vision IAS".', url: 'https://www.youtube.com/results?search_query=Vision+IAS', type: 'video', subject: 'Current Affairs', paper: 'All Papers', language: 'English' },
  { title: 'Vision IAS Open Test Series', description: 'Free open mock tests for Prelims.', url: 'https://visionias.in/opentest', type: 'text', subject: 'General', paper: 'Prelims GS I', language: 'English' },

  // ---- StudyIQ ----
  { title: 'StudyIQ IAS (YouTube)', description: 'Free daily current affairs and GS foundation videos — search "StudyIQ IAS".', url: 'https://www.youtube.com/results?search_query=StudyIQ+IAS', type: 'video', subject: 'General', paper: 'All Papers', language: 'English/Hindi' },

  // ---- Mrunal ----
  { title: 'Mrunal.org (Economy)', description: 'Deep-dive articles and lecture series on Indian Economy fundamentals.', url: 'https://mrunal.org', type: 'text', subject: 'Economy', paper: 'Mains GS III', language: 'English' },

  // ---- Sudarshan Gurjar ----
  { title: 'Sudarshan Gurjar (Geography)', description: 'Free geography notes and lecture videos, popular for Prelims + Mains geography.', url: 'https://sudarshangurjar.com', type: 'text', subject: 'Geography', paper: 'Prelims GS I', language: 'English/Hindi' },

  // ---- PMF IAS ----
  { title: 'PMF IAS', description: 'Concise notes on Geography, Environment and Science & Tech.', url: 'https://www.pmfias.com', type: 'text', subject: 'Environment', paper: 'Prelims GS I', language: 'English' },
  { title: 'PMF IAS - Environment & Ecology', description: 'Detailed notes on ecology, biodiversity and climate change.', url: 'https://www.pmfias.com', type: 'text', subject: 'Environment', paper: 'Mains GS III', language: 'English' },

  // ---- InsightsonIndia ----
  { title: 'InsightsonIndia Daily Current Affairs', description: 'Daily current affairs summary and daily answer writing initiative.', url: 'https://www.insightsonindia.com', type: 'current-affairs', subject: 'Current Affairs', paper: 'All Papers', language: 'English' },

  // ---- IASbaba ----
  { title: 'IASbaba', description: 'Daily current affairs, prelims test series and mains answer writing.', url: 'https://www.iasbaba.com', type: 'current-affairs', subject: 'Current Affairs', paper: 'All Papers', language: 'English' },

  // ---- Civilsdaily ----
  { title: 'Civilsdaily', description: 'Daily news analysis and free mind maps for quick revision.', url: 'https://www.civilsdaily.com', type: 'current-affairs', subject: 'Current Affairs', paper: 'All Papers', language: 'English' },

  // ---- ClearIAS ----
  { title: 'ClearIAS', description: 'Free study material and structured guidance for beginners.', url: 'https://www.clearias.com', type: 'text', subject: 'General', paper: 'All Papers', language: 'English' },

  // ---- GKToday ----
  { title: 'GKToday', description: 'General knowledge and current affairs quizzes and articles.', url: 'https://www.gktoday.in', type: 'current-affairs', subject: 'Current Affairs', paper: 'All Papers', language: 'English' },

  // ---- Arthapedia ----
  { title: 'Arthapedia', description: 'Wiki-style explanations of economic terms and concepts used in Indian policy.', url: 'http://www.arthapedia.in', type: 'text', subject: 'Economy', paper: 'Mains GS III', language: 'English' },

  // ---- Additional subject-distributed entries to round out to 50+ ----
  { title: 'NCERT Class 12 Political Science (Politics in India Since Independence)', description: 'Post-independence political developments, key for Mains GS I & II.', url: 'https://ncert.nic.in', type: 'text', subject: 'Polity', paper: 'Mains GS I', language: 'English/Hindi' },
  { title: 'NCERT Class 12 Fundamentals of Human Geography', description: 'Human geography concepts: population, settlements, economic activities.', url: 'https://ncert.nic.in', type: 'text', subject: 'Geography', paper: 'Mains GS I', language: 'English/Hindi' },
  { title: 'NIOS Sociology Study Material', description: 'Simplified sociology content, useful base before Optional-level depth.', url: 'https://www.nios.ac.in', type: 'text', subject: 'Sociology', paper: 'Optional', language: 'English/Hindi' },
  { title: 'SWAYAM: Ethics and Values Course', description: 'Free MOOC covering ethics theory — supports GS IV preparation.', url: 'https://swayam.gov.in', type: 'video', subject: 'Ethics', paper: 'Mains GS IV', language: 'English' },
  { title: 'PIB Science & Technology Releases', description: 'Filter PIB releases for S&T ministry updates — ISRO, DRDO, biotech.', url: 'https://pib.gov.in', type: 'current-affairs', subject: 'Science & Tech', paper: 'Prelims GS I', language: 'English/Hindi' },
  { title: 'PIB Environment & Forests Releases', description: 'Filter PIB releases from Ministry of Environment, Forest and Climate Change.', url: 'https://pib.gov.in', type: 'current-affairs', subject: 'Environment', paper: 'Mains GS III', language: 'English/Hindi' },
  { title: 'Drishti IAS Mains Answer Writing', description: 'Daily mains answer writing practice questions with model approach.', url: 'https://www.drishtiias.com', type: 'text', subject: 'General', paper: 'All Papers', language: 'English/Hindi' },
  { title: 'PRS: How a Bill becomes an Act', description: 'Explainer on the legislative process in India.', url: 'https://prsindia.org', type: 'text', subject: 'Polity', paper: 'Mains GS II', language: 'English' },
  { title: 'India Budget: Economic Survey Statistical Appendix', description: 'Data tables for economy-related Prelims facts.', url: 'https://www.indiabudget.gov.in', type: 'official-govt', subject: 'Economy', paper: 'Prelims GS I', language: 'English' },
  { title: 'NPTEL: Indian Economy Course', description: 'University-level video course on Indian economic development.', url: 'https://nptel.ac.in', type: 'video', subject: 'Economy', paper: 'Optional', language: 'English' },
  { title: 'Sansad TV: India\'s Constitution', description: 'Documentary-style series on the making of the Indian Constitution.', url: 'https://www.youtube.com/@sansadtv', type: 'video', subject: 'Polity', paper: 'Prelims GS I', language: 'English/Hindi' },
  { title: 'AIR Spotlight Archive', description: 'Daily policy discussion programme covering diverse GS topics.', url: 'https://newsonair.gov.in', type: 'audio', subject: 'Current Affairs', paper: 'Mains GS II', language: 'English/Hindi' },
  { title: 'GKToday Daily Quiz', description: 'Free daily current-affairs based MCQ quiz for Prelims practice.', url: 'https://www.gktoday.in', type: 'current-affairs', subject: 'CSAT', paper: 'CSAT', language: 'English' },
  { title: 'ClearIAS Prelims Test Series (free)', description: 'Free basic mock test series for Prelims.', url: 'https://www.clearias.com', type: 'text', subject: 'General', paper: 'Prelims GS I', language: 'English' },
  { title: 'NDLI: History Collections', description: 'Curated historical texts and references available for free access.', url: 'https://ndl.gov.in', type: 'text', subject: 'History', paper: 'Mains GS I', language: 'English' },
  { title: 'IGNOU eGyanKosh: Public Administration Notes', description: 'IGNOU MPA course material — useful for Public Administration optional.', url: 'https://egyankosh.ac.in', type: 'text', subject: 'Public Administration', paper: 'Optional', language: 'English/Hindi' },
  { title: 'PMF IAS: Science & Technology Notes', description: 'Concise S&T notes covering biotech, space, defence tech.', url: 'https://www.pmfias.com', type: 'text', subject: 'Science & Tech', paper: 'Mains GS III', language: 'English' },
  { title: 'Mrunal.org: Agriculture Economy', description: 'Detailed lecture series on agriculture-related economy topics.', url: 'https://mrunal.org', type: 'text', subject: 'Economy', paper: 'Mains GS III', language: 'English' },
  { title: 'Sudarshan Gurjar: World Geography Videos', description: 'Free video series covering world physical geography.', url: 'https://sudarshangurjar.com', type: 'video', subject: 'Geography', paper: 'Prelims GS I', language: 'English/Hindi' },
  { title: 'InsightsonIndia Mains Answer Writing Challenge', description: 'Daily mains-style questions for structured answer practice.', url: 'https://www.insightsonindia.com', type: 'text', subject: 'General', paper: 'All Papers', language: 'English' },
  { title: 'IASbaba Prelims Test Series (free samples)', description: 'Sample free mock questions for Prelims practice.', url: 'https://www.iasbaba.com', type: 'text', subject: 'General', paper: 'Prelims GS I', language: 'English' },
  { title: 'Civilsdaily Mindmaps', description: 'Visual mind maps for quick revision of GS topics.', url: 'https://www.civilsdaily.com', type: 'text', subject: 'General', paper: 'All Papers', language: 'English' },
]
