
import { Chapter, Question, Subject } from "@/types";

// ETI Chapters
export const etiChapters: Chapter[] = [
  { id: "eti-1", title: "Unit 1: Artificial Intelligence", subject: "ETI" },
  { id: "eti-2", title: "Unit 2: Internet of Things", subject: "ETI" },
  { id: "eti-3", title: "Unit 3: Basics of Digital Forensics", subject: "ETI" },
  { id: "eti-4", title: "Unit 4: Digital Evidence", subject: "ETI" },
  { id: "eti-5", title: "Unit 5: Basics of Hacking", subject: "ETI" },
  { id: "eti-6", title: "Unit 6: Types of Hacking", subject: "ETI" },
];

// MGT Chapters
export const mgtChapters: Chapter[] = [
  { id: "mgt-1", title: "Unit 1: Introduction to Management concepts and Managerial Skills", subject: "MGT" },
  { id: "mgt-2", title: "Unit 2: Planning and Organizing at supervisory level", subject: "MGT" },
  { id: "mgt-3", title: "Unit 3: Directing and controlling at supervisory level", subject: "MGT" },
  { id: "mgt-4", title: "Unit 4: Safety Management", subject: "MGT" },
  { id: "mgt-5", title: "Unit 5: Legislative Acts", subject: "MGT" },
];

// Get all chapters
export const allChapters: Chapter[] = [...etiChapters, ...mgtChapters];

// Sample ETI Questions
export const etiQuestions: Question[] = [
  {
    id: "q1",
    text: "What is a key characteristic of artificial intelligence?",
    chapterId: "eti-1",
    options: [
      { id: "q1-a", text: "It can only process numerical data", isCorrect: false },
      { id: "q1-b", text: "It requires human intervention for every decision", isCorrect: false },
      { id: "q1-c", text: "It can learn and adapt from experience", isCorrect: true },
      { id: "q1-d", text: "It always produces perfect results", isCorrect: false },
    ],
    explanation: "Artificial Intelligence systems are designed to learn from data and adapt their behavior based on experience, which makes them capable of improving over time without explicit programming for every scenario."
  },
  {
    id: "q2",
    text: "Which of the following is an example of IoT (Internet of Things)?",
    chapterId: "eti-2",
    options: [
      { id: "q2-a", text: "A standard desktop computer", isCorrect: false },
      { id: "q2-b", text: "A smart thermostat that adjusts based on your preferences", isCorrect: true },
      { id: "q2-c", text: "A printed book", isCorrect: false },
      { id: "q2-d", text: "A basic calculator", isCorrect: false },
    ],
    explanation: "Internet of Things (IoT) refers to everyday objects that have sensors, processing ability, and can connect to the internet to send and receive data. A smart thermostat is a perfect example as it monitors temperature, learns user preferences, and can be controlled remotely."
  },
  {
    id: "q3",
    text: "Which of the following is a primary goal of digital forensics?",
    chapterId: "eti-3",
    options: [
      { id: "q3-a", text: "Creating secure software", isCorrect: false },
      { id: "q3-b", text: "Designing computer networks", isCorrect: false },
      { id: "q3-c", text: "Preserving and analyzing digital evidence", isCorrect: true },
      { id: "q3-d", text: "Developing new computer hardware", isCorrect: false },
    ],
    explanation: "The primary goal of digital forensics is to preserve, identify, extract, document, and interpret digital evidence. This involves maintaining the integrity of the evidence while uncovering information relevant to an investigation."
  },
  {
    id: "q4",
    text: "What makes digital evidence different from physical evidence?",
    chapterId: "eti-4",
    options: [
      { id: "q4-a", text: "Digital evidence cannot be tampered with", isCorrect: false },
      { id: "q4-b", text: "Digital evidence is always admissible in court", isCorrect: false },
      { id: "q4-c", text: "Digital evidence is vulnerable to modification without visible signs", isCorrect: true },
      { id: "q4-d", text: "Digital evidence does not require chain of custody", isCorrect: false },
    ],
    explanation: "Unlike physical evidence, digital evidence can be modified or deleted without leaving obvious traces of tampering. This characteristic makes it particularly challenging to maintain the integrity of digital evidence, which is why special handling procedures are necessary."
  },
  {
    id: "q5",
    text: "What is the term for unauthorized access to computer systems?",
    chapterId: "eti-5",
    options: [
      { id: "q5-a", text: "Phishing", isCorrect: false },
      { id: "q5-b", text: "Hacking", isCorrect: true },
      { id: "q5-c", text: "Spamming", isCorrect: false },
      { id: "q5-d", text: "Defragmenting", isCorrect: false },
    ],
    explanation: "Hacking refers to activities that seek to compromise digital devices such as computers, smartphones, tablets, and even entire networks. While the term originally referred to constructive technical work, it now commonly refers to unauthorized access to computer systems."
  },
  {
    id: "q6",
    text: "Which type of hacking is performed with permission to identify vulnerabilities?",
    chapterId: "eti-6",
    options: [
      { id: "q6-a", text: "Black hat hacking", isCorrect: false },
      { id: "q6-b", text: "Phishing", isCorrect: false },
      { id: "q6-c", text: "Ethical hacking", isCorrect: true },
      { id: "q6-d", text: "Ransomware attacks", isCorrect: false },
    ],
    explanation: "Ethical hacking, also known as white hat hacking, involves security professionals who have explicit permission to break into systems to test and assess their security. The goal is to identify vulnerabilities before malicious hackers find them."
  },
];

// Sample MGT Questions
export const mgtQuestions: Question[] = [
  {
    id: "q7",
    text: "Which of the following is a key managerial skill?",
    chapterId: "mgt-1",
    options: [
      { id: "q7-a", text: "Technical prowess", isCorrect: false },
      { id: "q7-b", text: "Communication", isCorrect: true },
      { id: "q7-c", text: "Physical strength", isCorrect: false },
      { id: "q7-d", text: "Artistic ability", isCorrect: false },
    ]
  },
  {
    id: "q8",
    text: "What is a primary function of planning in management?",
    chapterId: "mgt-2",
    options: [
      { id: "q8-a", text: "To eliminate the need for controlling", isCorrect: false },
      { id: "q8-b", text: "To establish objectives and courses of action", isCorrect: true },
      { id: "q8-c", text: "To hire the right employees", isCorrect: false },
      { id: "q8-d", text: "To evaluate employee performance", isCorrect: false },
    ]
  },
  {
    id: "q9",
    text: "Which leadership style involves making decisions without consulting subordinates?",
    chapterId: "mgt-3",
    options: [
      { id: "q9-a", text: "Democratic", isCorrect: false },
      { id: "q9-b", text: "Laissez-faire", isCorrect: false },
      { id: "q9-c", text: "Autocratic", isCorrect: true },
      { id: "q9-d", text: "Participative", isCorrect: false },
    ]
  },
  {
    id: "q10",
    text: "What is a key component of effective safety management?",
    chapterId: "mgt-4",
    options: [
      { id: "q10-a", text: "Ignoring minor accidents", isCorrect: false },
      { id: "q10-b", text: "Focusing exclusively on production goals", isCorrect: false },
      { id: "q10-c", text: "Regular safety training and awareness", isCorrect: true },
      { id: "q10-d", text: "Minimizing documentation of incidents", isCorrect: false },
    ]
  },
  {
    id: "q11",
    text: "Which Act provides for compensation to workers for injuries sustained during employment?",
    chapterId: "mgt-5",
    options: [
      { id: "q11-a", text: "The Factories Act", isCorrect: false },
      { id: "q11-b", text: "The Employee State Insurance Act", isCorrect: false },
      { id: "q11-c", text: "The Workmen's Compensation Act", isCorrect: true },
      { id: "q11-d", text: "The Payment of Wages Act", isCorrect: false },
    ]
  },
];

// All questions
export const allQuestions: Question[] = [...etiQuestions, ...mgtQuestions];

// Get chapters by subject
export const getChaptersBySubject = (subject: Subject): Chapter[] => {
  return subject === "ETI" ? etiChapters : mgtChapters;
};

// Get questions by chapter
export const getQuestionsByChapter = (chapterId: string): Question[] => {
  return allQuestions.filter(question => question.chapterId === chapterId);
};
