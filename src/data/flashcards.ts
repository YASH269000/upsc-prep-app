export interface FlashcardSeed {
  subject: string
  front: string
  back: string
}

export const FLASHCARDS_SEED: FlashcardSeed[] = [
  // ---- Polity (12) ----
  { subject: 'Polity', front: 'Which Article of the Constitution abolishes untouchability?', back: 'Article 17 abolishes "untouchability" and forbids its practice in any form.' },
  { subject: 'Polity', front: 'What is the minimum age to become President of India?', back: '35 years, as per Article 58.' },
  { subject: 'Polity', front: 'Which Article provides for the establishment of the Election Commission of India?', back: 'Article 324 provides for the Election Commission of India to superintend, direct and control elections.' },
  { subject: 'Polity', front: 'How many Fundamental Duties are currently listed in the Constitution?', back: '11 Fundamental Duties, listed under Article 51A (Part IVA); the 11th was added by the 86th Amendment (2002).' },
  { subject: 'Polity', front: 'What is the tenure of a Supreme Court judge?', back: 'A Supreme Court judge holds office until the age of 65 years (Article 124).' },
  { subject: 'Polity', front: 'Which Amendment is known as the "Mini Constitution"?', back: 'The 42nd Amendment Act, 1976, due to the wide-ranging changes it made, is often called the "Mini Constitution".' },
  { subject: 'Polity', front: 'What is the quorum required to conduct a sitting of either House of Parliament?', back: 'One-tenth of the total membership of the House, as per Article 100.' },
  { subject: 'Polity', front: 'Under which Article can the President\'s Rule be imposed in a state?', back: 'Article 356, on grounds of failure of constitutional machinery in a state.' },
  { subject: 'Polity', front: 'What is the maximum gap allowed between two sessions of Parliament?', back: '6 months — Parliament must meet at least twice a year, with no more than 6 months between sessions.' },
  { subject: 'Polity', front: 'Which body recommends the imposition of GST rates in India?', back: 'The GST Council, chaired by the Union Finance Minister, comprising state finance ministers.' },
  { subject: 'Polity', front: 'What does the term "Judicial Review" mean?', back: 'The power of courts to examine the constitutionality of legislative and executive actions and strike down those that violate the Constitution.' },
  { subject: 'Polity', front: 'Which schedule lists the languages recognized by the Constitution?', back: 'The Eighth Schedule lists 22 officially recognized languages of India.' },

  // ---- History (10) ----
  { subject: 'History', front: 'Who founded the Arya Samaj in 1875?', back: 'Swami Dayananda Saraswati founded the Arya Samaj, advocating a return to Vedic principles and social reform.' },
  { subject: 'History', front: 'What was the significance of the Vernacular Press Act of 1878?', back: 'It empowered the British government to restrict the freedom of the Indian-language press, provoking nationalist resentment.' },
  { subject: 'History', front: 'Who gave the slogan "Swaraj is my birthright and I shall have it"?', back: 'Bal Gangadhar Tilak.' },
  { subject: 'History', front: 'What was the Rowlatt Act (1919)?', back: 'A repressive law allowing detention without trial, which sparked widespread protests led by Gandhi.' },
  { subject: 'History', front: 'When was the Government of India Act, 1935 passed and what was its significance?', back: 'Passed in 1935, it introduced provincial autonomy and served as a major source for the structure of the Indian Constitution.' },
  { subject: 'History', front: 'Who was the last Mughal Emperor, exiled after the Revolt of 1857?', back: 'Bahadur Shah Zafar II, exiled to Rangoon (Burma) by the British.' },
  { subject: 'History', front: 'What was the Poona Pact of 1932 about?', back: 'An agreement between Gandhi and Ambedkar replacing separate electorates for depressed classes with reserved seats in joint electorates.' },
  { subject: 'History', front: 'Who founded the Ramakrishna Mission in 1897?', back: 'Swami Vivekananda founded the Ramakrishna Mission for social service and spiritual regeneration.' },
  { subject: 'History', front: 'What was the primary demand of the Swadeshi Movement (1905-08)?', back: 'Boycott of British goods and promotion of indigenously made (swadeshi) products, sparked by the Partition of Bengal.' },
  { subject: 'History', front: 'Who was the first Governor-General of independent India?', back: 'Lord Mountbatten (until 1948), followed by C. Rajagopalachari as the first and only Indian Governor-General.' },

  // ---- Geography (10) ----
  { subject: 'Geography', front: 'What are the three major soil types found in the Indo-Gangetic plains?', back: 'Alluvial soil (khadar - newer, and bhangar - older), formed by river deposits.' },
  { subject: 'Geography', front: 'Which Indian state has the longest coastline?', back: 'Gujarat has the longest coastline among Indian states (about 1,600 km).' },
  { subject: 'Geography', front: 'What causes the formation of the Himalayas?', back: 'Collision of the Indian Plate with the Eurasian Plate, causing folding and uplift (an ongoing tectonic process).' },
  { subject: 'Geography', front: 'Name the three parallel ranges of the Himalayas from south to north.', back: 'Shiwaliks (Outer Himalayas), Middle/Lesser Himalayas (Himachal), and Greater Himalayas (Himadri).' },
  { subject: 'Geography', front: 'Which wind system is responsible for most of India\'s annual rainfall?', back: 'The Southwest (summer) Monsoon winds, blowing from sea to land between June-September.' },
  { subject: 'Geography', front: 'What is a "delta"?', back: 'A landform formed at a river mouth where sediment deposits as the river slows entering a larger body of water, e.g. Ganga-Brahmaputra Delta.' },
  { subject: 'Geography', front: 'Which is the largest desert in India?', back: 'The Thar Desert, located primarily in Rajasthan.' },
  { subject: 'Geography', front: 'What is the significance of the Radcliffe Line?', back: 'It is the boundary line demarcating India and Pakistan (and later Bangladesh), drawn by Sir Cyril Radcliffe in 1947.' },
  { subject: 'Geography', front: 'Which plateau is known as the "Storehouse of Minerals" in India?', back: 'The Chota Nagpur Plateau, rich in coal, iron ore, mica and bauxite.' },
  { subject: 'Geography', front: 'What is the difference between weather and climate?', back: 'Weather is the short-term atmospheric condition at a place; climate is the average weather pattern over a long period (usually 30+ years).' },

  // ---- Economy (10) ----
  { subject: 'Economy', front: 'What is "Fiscal Deficit"?', back: 'The difference between total government expenditure and total revenue (excluding borrowings) in a fiscal year.' },
  { subject: 'Economy', front: 'What does "Repo Rate" mean?', back: 'The rate at which the RBI lends short-term funds to commercial banks against government securities.' },
  { subject: 'Economy', front: 'What is "Reverse Repo Rate"?', back: 'The rate at which the RBI borrows money from commercial banks, used to absorb excess liquidity.' },
  { subject: 'Economy', front: 'What is meant by "Inflation Targeting"?', back: 'A monetary policy framework where the central bank aims to keep inflation within a specific target range (India: 4% +/- 2%).' },
  { subject: 'Economy', front: 'What is "Disinvestment"?', back: 'The process of the government selling or liquidating its stake in Public Sector Undertakings (PSUs).' },
  { subject: 'Economy', front: 'What does "CRR" (Cash Reserve Ratio) mean?', back: 'The minimum percentage of a bank\'s total deposits that must be kept as reserves with the RBI in cash form.' },
  { subject: 'Economy', front: 'What is "SLR" (Statutory Liquidity Ratio)?', back: 'The minimum percentage of deposits banks must maintain in liquid assets like cash, gold, or government securities.' },
  { subject: 'Economy', front: 'What is the difference between direct and indirect tax?', back: 'Direct tax burden cannot be shifted (e.g., income tax); indirect tax burden can be passed on to another party (e.g., GST).' },
  { subject: 'Economy', front: 'What is "Green GDP"?', back: 'A GDP measure that accounts for environmental costs (e.g. resource depletion, pollution) alongside economic output.' },
  { subject: 'Economy', front: 'What is "Universal Basic Income" (UBI)?', back: 'A proposed policy providing unconditional periodic cash payments to all citizens regardless of income, discussed in India\'s Economic Survey 2016-17.' },

  // ---- Environment (8) ----
  { subject: 'Environment', front: 'What is "Biodiversity Hotspot"?', back: 'A region with significant levels of biodiversity threatened by habitat loss; India has 4: Himalaya, Indo-Burma, Western Ghats-Sri Lanka, Sundaland.' },
  { subject: 'Environment', front: 'What is the "Montreal Protocol"?', back: 'An international treaty (1987) to phase out substances responsible for ozone layer depletion, such as CFCs.' },
  { subject: 'Environment', front: 'What is "Carbon Sequestration"?', back: 'The process of capturing and storing atmospheric carbon dioxide, e.g., through forests or geological storage.' },
  { subject: 'Environment', front: 'What is an "Invasive Species"?', back: 'A non-native species introduced to an ecosystem that causes ecological or economic harm, e.g., Lantana camara in India.' },
  { subject: 'Environment', front: 'What does IUCN Red List classify?', back: 'The global conservation status of species, ranging from Least Concern to Extinct, including categories like Endangered and Critically Endangered.' },
  { subject: 'Environment', front: 'What is "Eutrophication"?', back: 'Excessive nutrient enrichment (often nitrogen/phosphorus) in water bodies causing algal blooms and oxygen depletion.' },
  { subject: 'Environment', front: 'What is the significance of COP (Conference of Parties) in climate negotiations?', back: 'COP is the annual UNFCCC decision-making body where countries negotiate climate action; COP21 (2015) produced the Paris Agreement.' },
  { subject: 'Environment', front: 'What are "Particulate Matter" (PM2.5/PM10)?', back: 'Tiny airborne particles (2.5 or 10 micrometers or less) that are major air pollutants harmful to respiratory health.' },

  // ---- Science & Tech (10) ----
  { subject: 'Science & Tech', front: 'What is ISRO\'s Gaganyaan mission?', back: 'India\'s planned human spaceflight program aiming to send astronauts into low Earth orbit using an indigenous crew module.' },
  { subject: 'Science & Tech', front: 'What is "5G" technology primarily known for?', back: 'Fifth-generation mobile network technology offering higher speed, lower latency, and greater device connectivity than 4G.' },
  { subject: 'Science & Tech', front: 'What is "Blockchain"?', back: 'A distributed, decentralized digital ledger technology that records transactions across multiple computers securely and transparently.' },
  { subject: 'Science & Tech', front: 'What is the function of DRDO\'s Agni missile series?', back: 'Agni is a series of medium- to intercontinental-range ballistic missiles developed by DRDO for India\'s strategic deterrence.' },
  { subject: 'Science & Tech', front: 'What is "Gene Therapy"?', back: 'A medical technique that treats or prevents disease by correcting or replacing defective genes in a patient\'s cells.' },
  { subject: 'Science & Tech', front: 'What is the purpose of the James Webb Space Telescope?', back: 'An infrared space telescope (NASA/ESA/CSA) designed to observe the earliest galaxies and study exoplanets.' },
  { subject: 'Science & Tech', front: 'What is "Artificial Intelligence" (AI) in simple terms?', back: 'The simulation of human intelligence processes (learning, reasoning, self-correction) by computer systems.' },
  { subject: 'Science & Tech', front: 'What does "Nanotechnology" involve?', back: 'The manipulation of matter at the nanoscale (1-100 nanometers) to create materials/devices with novel properties.' },
  { subject: 'Science & Tech', front: 'What is India\'s indigenous supercomputing mission called?', back: 'The National Supercomputing Mission (NSM), aimed at building high-performance computing infrastructure.' },
  { subject: 'Science & Tech', front: 'What is "Herd Immunity"?', back: 'Indirect protection from infectious disease when a large percentage of a population becomes immune, reducing disease spread.' },

  // ---- Ethics (5) ----
  { subject: 'Ethics', front: 'What is the difference between "Ethics" and "Morals"?', back: 'Ethics refers to externally imposed societal/professional codes of conduct; morals refer to an individual\'s internal principles of right/wrong.' },
  { subject: 'Ethics', front: 'What is "Emotional Intelligence" (EI)?', back: 'The capacity to recognize, understand and manage one\'s own emotions and those of others, often broken into self-awareness, self-regulation, motivation, empathy, and social skills.' },
  { subject: 'Ethics', front: 'What is meant by "Probity in Governance"?', back: 'Adherence to high ethical standards — integrity, honesty, transparency and accountability — in the conduct of public affairs.' },
  { subject: 'Ethics', front: 'What did Immanuel Kant\'s "Categorical Imperative" propose?', back: 'That one should act only according to principles that could be universalized as a general law, treating people as ends, never merely as means.' },
  { subject: 'Ethics', front: 'What is a "Conflict of Interest"?', back: 'A situation where a public official\'s personal interests could improperly influence their official duties or decisions.' },

  // ---- CSAT / Misc (5) ----
  { subject: 'CSAT', front: 'What is the formula for Simple Interest?', back: 'SI = (Principal x Rate x Time) / 100.' },
  { subject: 'CSAT', front: 'What is the formula for Compound Interest (annual compounding)?', back: 'CI = P(1 + R/100)^T - P, where P=Principal, R=Rate, T=Time in years.' },
  { subject: 'CSAT', front: 'What does "BODMAS" stand for in order of operations?', back: 'Brackets, Orders (powers/roots), Division, Multiplication, Addition, Subtraction.' },
  { subject: 'CSAT', front: 'What is a Syllogism in logical reasoning?', back: 'A form of deductive reasoning where a conclusion is drawn from two given premises/statements.' },
  { subject: 'CSAT', front: 'What is the key skill tested in Reading Comprehension passages?', back: 'The ability to understand explicit and implicit meaning, tone, and central idea of a written passage.' },
]
