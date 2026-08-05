import type { SyllabusTopic } from '../db/db'

// Each topic: id (stable), section, parent, title, titleHi, order
// linkedResourceIds are matched by subject/paper at render time (not hardcoded ids)
// so the resource directory can grow independently.

type SeedTopic = Omit<SyllabusTopic, 'studied' | 'studiedAt'>

const t = (id: string, section: string, parent: string | null, order: number, title: string, titleHi: string): SeedTopic => ({
  id, section, parent, order, title, titleHi,
})

export const SYLLABUS_SEED: SeedTopic[] = [
  // ============ PRELIMS GS PAPER I ============
  t('prelims-gs1', 'Prelims GS Paper I', null, 1, 'Prelims General Studies Paper I', 'प्रारंभिक सामान्य अध्ययन प्रश्नपत्र I'),

  t('p1-history', 'Prelims GS Paper I', 'prelims-gs1', 1, 'History of India & Indian National Movement', 'भारत का इतिहास एवं राष्ट्रीय आंदोलन'),
  t('p1-history-ancient', 'Prelims GS Paper I', 'p1-history', 1, 'Ancient India', 'प्राचीन भारत'),
  t('p1-history-medieval', 'Prelims GS Paper I', 'p1-history', 2, 'Medieval India', 'मध्यकालीन भारत'),
  t('p1-history-modern', 'Prelims GS Paper I', 'p1-history', 3, 'Modern India & Freedom Struggle', 'आधुनिक भारत एवं स्वतंत्रता संग्राम'),
  t('p1-history-art-culture', 'Prelims GS Paper I', 'p1-history', 4, 'Art & Culture', 'कला एवं संस्कृति'),

  t('p1-geography', 'Prelims GS Paper I', 'prelims-gs1', 2, 'Indian & World Geography', 'भारतीय एवं विश्व भूगोल'),
  t('p1-geo-physical', 'Prelims GS Paper I', 'p1-geography', 1, 'Physical Geography', 'भौतिक भूगोल'),
  t('p1-geo-india', 'Prelims GS Paper I', 'p1-geography', 2, 'Geography of India', 'भारत का भूगोल'),
  t('p1-geo-world', 'Prelims GS Paper I', 'p1-geography', 3, 'World Geography', 'विश्व भूगोल'),
  t('p1-geo-economic', 'Prelims GS Paper I', 'p1-geography', 4, 'Economic Geography & Resources', 'आर्थिक भूगोल एवं संसाधन'),

  t('p1-polity', 'Prelims GS Paper I', 'prelims-gs1', 3, 'Indian Polity & Governance', 'भारतीय राजव्यवस्था एवं शासन'),
  t('p1-polity-constitution', 'Prelims GS Paper I', 'p1-polity', 1, 'Constitution: Basic Features & Schedules', 'संविधान: मूल विशेषताएं एवं अनुसूचियां'),
  t('p1-polity-rights', 'Prelims GS Paper I', 'p1-polity', 2, 'Fundamental Rights, DPSP, Fundamental Duties', 'मौलिक अधिकार, नीति निदेशक तत्व, मौलिक कर्तव्य'),
  t('p1-polity-union', 'Prelims GS Paper I', 'p1-polity', 3, 'Union Executive, Legislature, Judiciary', 'संघ कार्यपालिका, विधायिका, न्यायपालिका'),
  t('p1-polity-state', 'Prelims GS Paper I', 'p1-polity', 4, 'State Government & Centre-State Relations', 'राज्य सरकार एवं केंद्र-राज्य संबंध'),
  t('p1-polity-local', 'Prelims GS Paper I', 'p1-polity', 5, 'Panchayati Raj & Urban Local Bodies', 'पंचायती राज एवं शहरी स्थानीय निकाय'),
  t('p1-polity-bodies', 'Prelims GS Paper I', 'p1-polity', 6, 'Constitutional & Statutory Bodies', 'संवैधानिक एवं वैधानिक निकाय'),

  t('p1-economy', 'Prelims GS Paper I', 'prelims-gs1', 4, 'Economic & Social Development', 'आर्थिक एवं सामाजिक विकास'),
  t('p1-eco-basics', 'Prelims GS Paper I', 'p1-economy', 1, 'Basic Economic Concepts & National Income', 'बुनियादी आर्थिक अवधारणाएं एवं राष्ट्रीय आय'),
  t('p1-eco-banking', 'Prelims GS Paper I', 'p1-economy', 2, 'Money, Banking & Financial Markets', 'मुद्रा, बैंकिंग एवं वित्तीय बाजार'),
  t('p1-eco-budget', 'Prelims GS Paper I', 'p1-economy', 3, 'Government Budgeting & Fiscal Policy', 'सरकारी बजट एवं राजकोषीय नीति'),
  t('p1-eco-schemes', 'Prelims GS Paper I', 'p1-economy', 4, 'Government Schemes & Inclusive Growth', 'सरकारी योजनाएं एवं समावेशी विकास'),

  t('p1-environment', 'Prelims GS Paper I', 'prelims-gs1', 5, 'Environmental Ecology, Biodiversity & Climate Change', 'पर्यावरण पारिस्थितिकी, जैव विविधता एवं जलवायु परिवर्तन'),
  t('p1-env-ecology', 'Prelims GS Paper I', 'p1-environment', 1, 'Ecology & Ecosystems Basics', 'पारिस्थितिकी एवं पारिस्थितिकी तंत्र'),
  t('p1-env-biodiversity', 'Prelims GS Paper I', 'p1-environment', 2, 'Biodiversity & Protected Areas', 'जैव विविधता एवं संरक्षित क्षेत्र'),
  t('p1-env-climate', 'Prelims GS Paper I', 'p1-environment', 3, 'Climate Change & International Agreements', 'जलवायु परिवर्तन एवं अंतर्राष्ट्रीय समझौते'),
  t('p1-env-pollution', 'Prelims GS Paper I', 'p1-environment', 4, 'Pollution & Environmental Policy', 'प्रदूषण एवं पर्यावरण नीति'),

  t('p1-science', 'Prelims GS Paper I', 'prelims-gs1', 6, 'General Science', 'सामान्य विज्ञान'),
  t('p1-sci-tech', 'Prelims GS Paper I', 'p1-science', 1, 'Science & Technology Current Developments', 'विज्ञान एवं प्रौद्योगिकी में हाल के विकास'),
  t('p1-sci-space', 'Prelims GS Paper I', 'p1-science', 2, 'Space Technology', 'अंतरिक्ष प्रौद्योगिकी'),
  t('p1-sci-defence', 'Prelims GS Paper I', 'p1-science', 3, 'Defence Technology', 'रक्षा प्रौद्योगिकी'),
  t('p1-sci-biotech', 'Prelims GS Paper I', 'p1-science', 4, 'Biotechnology & Health', 'जैव प्रौद्योगिकी एवं स्वास्थ्य'),

  t('p1-current', 'Prelims GS Paper I', 'prelims-gs1', 7, 'Current Events of National & International Importance', 'राष्ट्रीय एवं अंतर्राष्ट्रीय महत्व की समसामयिक घटनाएं'),

  // ============ CSAT ============
  t('csat', 'CSAT (Prelims GS Paper II)', null, 2, 'Civil Services Aptitude Test', 'सिविल सेवा योग्यता परीक्षा'),
  t('csat-comprehension', 'CSAT (Prelims GS Paper II)', 'csat', 1, 'Reading Comprehension', 'गद्यांश बोध'),
  t('csat-reasoning', 'CSAT (Prelims GS Paper II)', 'csat', 2, 'Logical Reasoning & Analytical Ability', 'तार्किक तर्क एवं विश्लेषणात्मक क्षमता'),
  t('csat-quant', 'CSAT (Prelims GS Paper II)', 'csat', 3, 'Basic Numeracy & Quantitative Aptitude', 'बुनियादी संख्यात्मकता एवं मात्रात्मक योग्यता'),
  t('csat-decision', 'CSAT (Prelims GS Paper II)', 'csat', 4, 'Decision Making & Problem Solving', 'निर्णय लेना एवं समस्या समाधान'),
  t('csat-data', 'CSAT (Prelims GS Paper II)', 'csat', 5, 'Data Interpretation', 'डेटा व्याख्या'),

  // ============ MAINS GS I ============
  t('mains-gs1', 'Mains GS Paper I', null, 3, 'Indian Heritage, Culture, History & Geography', 'भारतीय विरासत, संस्कृति, इतिहास एवं भूगोल'),
  t('m1-culture', 'Mains GS Paper I', 'mains-gs1', 1, 'Indian Culture: Art Forms, Literature, Architecture', 'भारतीय संस्कृति: कला रूप, साहित्य, वास्तुकला'),
  t('m1-history-ancient-medieval', 'Mains GS Paper I', 'mains-gs1', 2, 'Ancient & Medieval Indian History', 'प्राचीन एवं मध्यकालीन भारतीय इतिहास'),
  t('m1-history-modern', 'Mains GS Paper I', 'mains-gs1', 3, 'Modern Indian History (18th century onwards)', 'आधुनिक भारतीय इतिहास (18वीं सदी से)'),
  t('m1-freedom-struggle', 'Mains GS Paper I', 'mains-gs1', 4, 'Freedom Struggle & Post-Independence Consolidation', 'स्वतंत्रता संग्राम एवं स्वतंत्रता पश्चात एकीकरण'),
  t('m1-world-history', 'Mains GS Paper I', 'mains-gs1', 5, 'World History (18th century events)', 'विश्व इतिहास (18वीं सदी की घटनाएं)'),
  t('m1-society', 'Mains GS Paper I', 'mains-gs1', 6, 'Indian Society: Diversity, Women, Poverty', 'भारतीय समाज: विविधता, महिलाएं, गरीबी'),
  t('m1-globalization-society', 'Mains GS Paper I', 'mains-gs1', 7, 'Effects of Globalization on Indian Society', 'भारतीय समाज पर वैश्वीकरण का प्रभाव'),
  t('m1-social-empowerment', 'Mains GS Paper I', 'mains-gs1', 8, 'Social Empowerment, Communalism, Regionalism', 'सामाजिक सशक्तिकरण, सांप्रदायिकता, क्षेत्रवाद'),
  t('m1-geo-physical', 'Mains GS Paper I', 'mains-gs1', 9, 'Physical Geography (salient features)', 'भौतिक भूगोल (प्रमुख विशेषताएं)'),
  t('m1-geo-resources', 'Mains GS Paper I', 'mains-gs1', 10, 'Distribution of Resources', 'संसाधनों का वितरण'),
  t('m1-geo-industry', 'Mains GS Paper I', 'mains-gs1', 11, 'Factors for Location of Industries', 'उद्योगों के स्थान हेतु कारक'),
  t('m1-geo-phenomena', 'Mains GS Paper I', 'mains-gs1', 12, 'Important Geophysical Phenomena', 'महत्वपूर्ण भू-भौतिकीय घटनाएं'),

  // ============ MAINS GS II ============
  t('mains-gs2', 'Mains GS Paper II', null, 4, 'Governance, Constitution, Polity, Social Justice & IR', 'शासन, संविधान, राजव्यवस्था, सामाजिक न्याय एवं अंतर्राष्ट्रीय संबंध'),
  t('m2-constitution', 'Mains GS Paper II', 'mains-gs2', 1, 'Indian Constitution: Historical Underpinnings & Features', 'भारतीय संविधान: ऐतिहासिक आधार एवं विशेषताएं'),
  t('m2-union-state', 'Mains GS Paper II', 'mains-gs2', 2, 'Functions & Responsibilities of Union & States', 'संघ एवं राज्यों के कार्य एवं उत्तरदायित्व'),
  t('m2-separation-powers', 'Mains GS Paper II', 'mains-gs2', 3, 'Separation of Powers, Dispute Redressal Mechanisms', 'शक्तियों का पृथक्करण, विवाद निवारण तंत्र'),
  t('m2-comparative-constitution', 'Mains GS Paper II', 'mains-gs2', 4, 'Comparison of Indian Constitutional Scheme with Others', 'भारतीय संवैधानिक व्यवस्था की अन्य से तुलना'),
  t('m2-parliament', 'Mains GS Paper II', 'mains-gs2', 5, 'Parliament & State Legislatures', 'संसद एवं राज्य विधानमंडल'),
  t('m2-executive-judiciary', 'Mains GS Paper II', 'mains-gs2', 6, 'Executive & Judiciary Structure', 'कार्यपालिका एवं न्यायपालिका संरचना'),
  t('m2-bodies', 'Mains GS Paper II', 'mains-gs2', 7, 'Statutory, Regulatory & Quasi-Judicial Bodies', 'वैधानिक, नियामक एवं अर्ध-न्यायिक निकाय'),
  t('m2-govt-policies', 'Mains GS Paper II', 'mains-gs2', 8, 'Government Policies & Interventions', 'सरकारी नीतियां एवं हस्तक्षेप'),
  t('m2-welfare-schemes', 'Mains GS Paper II', 'mains-gs2', 9, 'Welfare Schemes for Vulnerable Sections', 'कमजोर वर्गों हेतु कल्याणकारी योजनाएं'),
  t('m2-social-sector', 'Mains GS Paper II', 'mains-gs2', 10, 'Social Sector: Health, Education, HRD', 'सामाजिक क्षेत्र: स्वास्थ्य, शिक्षा, मानव संसाधन विकास'),
  t('m2-governance', 'Mains GS Paper II', 'mains-gs2', 11, 'Governance, Transparency & Accountability', 'शासन, पारदर्शिता एवं जवाबदेही'),
  t('m2-egovernance', 'Mains GS Paper II', 'mains-gs2', 12, 'e-Governance Applications', 'ई-गवर्नेंस अनुप्रयोग'),
  t('m2-ngo-sha', 'Mains GS Paper II', 'mains-gs2', 13, 'Role of NGOs, SHGs, Civil Society', 'गैर सरकारी संगठन, स्वयं सहायता समूह, नागरिक समाज की भूमिका'),
  t('m2-ir', 'Mains GS Paper II', 'mains-gs2', 14, 'India & Neighbourhood Relations', 'भारत एवं पड़ोसी संबंध'),
  t('m2-ir-groupings', 'Mains GS Paper II', 'mains-gs2', 15, 'Bilateral, Regional, Global Groupings & Agreements', 'द्विपक्षीय, क्षेत्रीय, वैश्विक समूह एवं समझौते'),
  t('m2-diaspora', 'Mains GS Paper II', 'mains-gs2', 16, 'Indian Diaspora', 'भारतीय प्रवासी'),
  t('m2-intl-bodies', 'Mains GS Paper II', 'mains-gs2', 17, 'Important International Institutions', 'महत्वपूर्ण अंतर्राष्ट्रीय संस्थान'),

  // ============ MAINS GS III ============
  t('mains-gs3', 'Mains GS Paper III', null, 5, 'Technology, Economic Development, Biodiversity, Security & Disaster Mgmt', 'प्रौद्योगिकी, आर्थिक विकास, जैव विविधता, सुरक्षा एवं आपदा प्रबंधन'),
  t('m3-economy-planning', 'Mains GS Paper III', 'mains-gs3', 1, 'Indian Economy: Planning, Mobilization of Resources', 'भारतीय अर्थव्यवस्था: योजना, संसाधन जुटाना'),
  t('m3-growth-development', 'Mains GS Paper III', 'mains-gs3', 2, 'Inclusive Growth & Issues', 'समावेशी विकास एवं मुद्दे'),
  t('m3-budgeting', 'Mains GS Paper III', 'mains-gs3', 3, 'Government Budgeting', 'सरकारी बजट'),
  t('m3-agriculture', 'Mains GS Paper III', 'mains-gs3', 4, 'Agriculture: Cropping Patterns, Irrigation, MSP, PDS', 'कृषि: फसल पैटर्न, सिंचाई, न्यूनतम समर्थन मूल्य, सार्वजनिक वितरण प्रणाली'),
  t('m3-food-processing', 'Mains GS Paper III', 'mains-gs3', 5, 'Food Processing & Related Industries', 'खाद्य प्रसंस्करण एवं संबंधित उद्योग'),
  t('m3-land-reforms', 'Mains GS Paper III', 'mains-gs3', 6, 'Land Reforms', 'भूमि सुधार'),
  t('m3-liberalization', 'Mains GS Paper III', 'mains-gs3', 7, 'Liberalization & Effects on Industrial Growth', 'उदारीकरण एवं औद्योगिक विकास पर प्रभाव'),
  t('m3-infrastructure', 'Mains GS Paper III', 'mains-gs3', 8, 'Infrastructure: Energy, Ports, Roads, Airports, Railways', 'बुनियादी ढांचा: ऊर्जा, बंदरगाह, सड़कें, हवाई अड्डे, रेलवे'),
  t('m3-investment-models', 'Mains GS Paper III', 'mains-gs3', 9, 'Investment Models (PPP etc.)', 'निवेश मॉडल (पीपीपी आदि)'),
  t('m3-sci-tech-daily', 'Mains GS Paper III', 'mains-gs3', 10, 'Science & Technology: Developments & Applications', 'विज्ञान एवं प्रौद्योगिकी: विकास एवं अनुप्रयोग'),
  t('m3-space-it', 'Mains GS Paper III', 'mains-gs3', 11, 'Space, IT, Computers, Robotics, Nano-tech, Biotech', 'अंतरिक्ष, आईटी, कंप्यूटर, रोबोटिक्स, नैनो-तकनीक, जैव प्रौद्योगिकी'),
  t('m3-ipr', 'Mains GS Paper III', 'mains-gs3', 12, 'Intellectual Property Rights', 'बौद्धिक संपदा अधिकार'),
  t('m3-environment-conservation', 'Mains GS Paper III', 'mains-gs3', 13, 'Conservation, Environmental Pollution & Degradation', 'संरक्षण, पर्यावरण प्रदूषण एवं क्षरण'),
  t('m3-eia', 'Mains GS Paper III', 'mains-gs3', 14, 'Environmental Impact Assessment', 'पर्यावरण प्रभाव आकलन'),
  t('m3-disaster-mgmt', 'Mains GS Paper III', 'mains-gs3', 15, 'Disaster & Disaster Management', 'आपदा एवं आपदा प्रबंधन'),
  t('m3-internal-security', 'Mains GS Paper III', 'mains-gs3', 16, 'Internal Security: Extremism, Insurgency', 'आंतरिक सुरक्षा: उग्रवाद, विद्रोह'),
  t('m3-external-security', 'Mains GS Paper III', 'mains-gs3', 17, 'Role of External State & Non-State Actors', 'बाहरी राज्य एवं गैर-राज्य अभिकर्ताओं की भूमिका'),
  t('m3-cyber-security', 'Mains GS Paper III', 'mains-gs3', 18, 'Cyber Security & Money Laundering', 'साइबर सुरक्षा एवं मनी लॉन्ड्रिंग'),
  t('m3-border-security', 'Mains GS Paper III', 'mains-gs3', 19, 'Border Security & Organized Crime-Terrorism Linkages', 'सीमा सुरक्षा एवं संगठित अपराध-आतंकवाद संबंध'),
  t('m3-security-forces', 'Mains GS Paper III', 'mains-gs3', 20, 'Security Forces & Agencies: Mandate', 'सुरक्षा बल एवं एजेंसियां: अधिदेश'),

  // ============ MAINS GS IV ============
  t('mains-gs4', 'Mains GS Paper IV', null, 6, 'Ethics, Integrity & Aptitude', 'नैतिकता, सत्यनिष्ठा एवं अभिवृत्ति'),
  t('m4-ethics-humans', 'Mains GS Paper IV', 'mains-gs4', 1, 'Ethics & Human Interface', 'नैतिकता एवं मानव अंतरापृष्ठ'),
  t('m4-attitude', 'Mains GS Paper IV', 'mains-gs4', 2, 'Attitude: Content, Structure, Function', 'अभिवृत्ति: सामग्री, संरचना, कार्य'),
  t('m4-aptitude-foundational', 'Mains GS Paper IV', 'mains-gs4', 3, 'Aptitude & Foundational Values for Civil Service', 'सिविल सेवा हेतु अभिवृत्ति एवं आधारभूत मूल्य'),
  t('m4-emotional-intelligence', 'Mains GS Paper IV', 'mains-gs4', 4, 'Emotional Intelligence', 'भावनात्मक बुद्धिमत्ता'),
  t('m4-thinkers', 'Mains GS Paper IV', 'mains-gs4', 5, 'Contributions of Moral Thinkers & Philosophers', 'नैतिक विचारकों एवं दार्शनिकों का योगदान'),
  t('m4-public-service-values', 'Mains GS Paper IV', 'mains-gs4', 6, 'Public/Civil Service Values & Ethics in Public Administration', 'लोक/सिविल सेवा मूल्य एवं लोक प्रशासन में नैतिकता'),
  t('m4-probity', 'Mains GS Paper IV', 'mains-gs4', 7, 'Probity in Governance', 'शासन में सुचिता'),
  t('m4-case-studies', 'Mains GS Paper IV', 'mains-gs4', 8, 'Case Studies on above issues', 'उपरोक्त मुद्दों पर केस स्टडी'),

  // ============ ESSAY ============
  t('essay', 'Essay', null, 7, 'Essay Paper', 'निबंध प्रश्नपत्र'),
  t('essay-practice', 'Essay', 'essay', 1, 'Essay Writing Practice & Structure', 'निबंध लेखन अभ्यास एवं संरचना'),
  t('essay-topics', 'Essay', 'essay', 2, 'Philosophical & Current Topics', 'दार्शनिक एवं समसामयिक विषय'),

  // ============ OPTIONAL SUBJECTS (representative listing) ============
  t('optional-sociology', 'Optional - Sociology', null, 8, 'Sociology Optional', 'समाजशास्त्र वैकल्पिक विषय'),
  t('opt-soc-1', 'Optional - Sociology', 'optional-sociology', 1, 'Paper I: Fundamentals of Sociology', 'प्रश्नपत्र I: समाजशास्त्र के मूल सिद्धांत'),
  t('opt-soc-2', 'Optional - Sociology', 'optional-sociology', 2, 'Paper II: Indian Society: Structure and Change', 'प्रश्नपत्र II: भारतीय समाज: संरचना एवं परिवर्तन'),

  t('optional-psir', 'Optional - PSIR', null, 9, 'Political Science & International Relations Optional', 'राजनीति विज्ञान एवं अंतर्राष्ट्रीय संबंध वैकल्पिक विषय'),
  t('opt-psir-1', 'Optional - PSIR', 'optional-psir', 1, 'Paper I: Political Theory & Indian Government', 'प्रश्नपत्र I: राजनीतिक सिद्धांत एवं भारतीय शासन'),
  t('opt-psir-2', 'Optional - PSIR', 'optional-psir', 2, 'Paper II: Comparative Politics & International Relations', 'प्रश्नपत्र II: तुलनात्मक राजनीति एवं अंतर्राष्ट्रीय संबंध'),

  t('optional-geography', 'Optional - Geography', null, 10, 'Geography Optional', 'भूगोल वैकल्पिक विषय'),
  t('opt-geo-1', 'Optional - Geography', 'optional-geography', 1, 'Paper I: Physical & Human Geography', 'प्रश्नपत्र I: भौतिक एवं मानव भूगोल'),
  t('opt-geo-2', 'Optional - Geography', 'optional-geography', 2, 'Paper II: Geography of India', 'प्रश्नपत्र II: भारत का भूगोल'),

  t('optional-history', 'Optional - History', null, 11, 'History Optional', 'इतिहास वैकल्पिक विषय'),
  t('opt-hist-1', 'Optional - History', 'optional-history', 1, 'Paper I: Ancient to Modern Indian History', 'प्रश्नपत्र I: प्राचीन से आधुनिक भारतीय इतिहास'),
  t('opt-hist-2', 'Optional - History', 'optional-history', 2, 'Paper II: World History & Post-Independence India', 'प्रश्नपत्र II: विश्व इतिहास एवं स्वतंत्रता पश्चात भारत'),

  t('optional-public-admin', 'Optional - Public Administration', null, 12, 'Public Administration Optional', 'लोक प्रशासन वैकल्पिक विषय'),
  t('opt-pa-1', 'Optional - Public Administration', 'optional-public-admin', 1, 'Paper I: Administrative Theory', 'प्रश्नपत्र I: प्रशासनिक सिद्धांत'),
  t('opt-pa-2', 'Optional - Public Administration', 'optional-public-admin', 2, 'Paper II: Indian Administration', 'प्रश्नपत्र II: भारतीय प्रशासन'),

  t('optional-anthropology', 'Optional - Anthropology', null, 13, 'Anthropology Optional', 'नृविज्ञान वैकल्पिक विषय'),
  t('opt-anthro-1', 'Optional - Anthropology', 'optional-anthropology', 1, 'Paper I: Social-Cultural & Physical Anthropology', 'प्रश्नपत्र I: सामाजिक-सांस्कृतिक एवं भौतिक नृविज्ञान'),
  t('opt-anthro-2', 'Optional - Anthropology', 'optional-anthropology', 2, 'Paper II: Indian Anthropology', 'प्रश्नपत्र II: भारतीय नृविज्ञान'),

  t('optional-economics', 'Optional - Economics', null, 14, 'Economics Optional', 'अर्थशास्त्र वैकल्पिक विषय'),
  t('opt-eco-1', 'Optional - Economics', 'optional-economics', 1, 'Paper I: Advanced Micro & Macro Economics', 'प्रश्नपत्र I: उन्नत सूक्ष्म एवं स्थूल अर्थशास्त्र'),
  t('opt-eco-2', 'Optional - Economics', 'optional-economics', 2, 'Paper II: Indian Economy', 'प्रश्नपत्र II: भारतीय अर्थव्यवस्था'),
]

export function seedTopics(): SyllabusTopic[] {
  return SYLLABUS_SEED.map((s) => ({ ...s, studied: false, studiedAt: null }))
}
