// 30 Assessment Questions & 20 Quiz Questions for Cyber Security
const assessmentQuestions = [
  {
    questionNumber: 1,
    questionText: 'What are the three pillars of information security represented by the CIA Triad?',
    options: ['Control, Isolation, Access', 'Confidentiality, Integrity, Availability', 'Cryptography, Inspection, Authorization', 'Cyber, Internet, Authentication'],
    correctAnswer: 1,
    explanation: 'The CIA Triad consists of Confidentiality (privacy), Integrity (accuracy/trustworthiness), and Availability (accessibility).'
  },
  {
    questionNumber: 2,
    questionText: 'What is the primary difference between symmetric and asymmetric cryptography?',
    options: ['Symmetric uses one shared key; asymmetric uses a public/private key pair', 'Symmetric is always slower than asymmetric', 'Asymmetric cannot be used for encryption', 'Symmetric requires hardware dongles'],
    correctAnswer: 0,
    explanation: 'Symmetric encryption uses the same secret key for both encryption and decryption, while asymmetric uses mathematically linked key pairs.'
  },
  {
    questionNumber: 3,
    questionText: 'How can developers reliably prevent SQL Injection vulnerabilities in web applications?',
    options: ['By hiding the database password in client JavaScript', 'By using Prepared Statements (Parameterized Queries) and Object-Relational Mapping (ORM)', 'By converting all inputs to uppercase', 'By using GET instead of POST'],
    correctAnswer: 1,
    explanation: 'Parameterized queries ensure the database engine treats input strictly as data, never as executable SQL commands.'
  },
  {
    questionNumber: 4,
    questionText: 'What is a Cross-Site Scripting (XSS) attack?',
    options: ['An attacker deleting tables directly from a database', 'An attack where malicious executable scripts are injected into trusted web applications and executed in victims\' browsers', 'Flooding a web server with bandwidth traffic', 'Stealing hardware components'],
    correctAnswer: 1,
    explanation: 'XSS injects malicious client-side scripts executed by the browser within the context of a legitimate user session.'
  },
  {
    questionNumber: 5,
    questionText: 'What is the purpose of a "Salt" in password hashing algorithms like bcrypt?',
    options: ['To speed up hashing performance', 'A random sequence of bytes added to passwords before hashing to protect against Rainbow Table and dictionary attacks', 'To reverse the hash back into plain text', 'To restrict password length to 8 characters'],
    correctAnswer: 1,
    explanation: 'Salts introduce unique entropy so identical passwords produce completely different hash outputs, defeating precomputed rainbow tables.'
  },
  {
    questionNumber: 6,
    questionText: 'Which type of firewall inspects TCP three-way handshakes and tracks the state of active network connections?',
    options: ['Stateless Packet Filter', 'Stateful Inspection Firewall', 'Analog Circuit Relay', 'Application Gateway Proxy'],
    correctAnswer: 1,
    explanation: 'Stateful firewalls maintain a state table of established connections and evaluate packets based on full connection context.'
  },
  {
    questionNumber: 7,
    questionText: 'What is Cross-Site Request Forgery (CSRF)?',
    options: ['Cracking Wi-Fi WPA2 passwords', 'Tricking an authenticated user into executing unwanted actions on a trusted web application without their consent', 'Installing ransomware on mobile devices', 'Injecting JavaScript into cookies'],
    correctAnswer: 1,
    explanation: 'CSRF exploits the trust a web app has in the victim\'s browser by submitting unauthorized requests using existing session credentials.'
  },
  {
    questionNumber: 8,
    questionText: 'What is the function of a Public Key Infrastructure (PKI) Certificate Authority (CA)?',
    options: ['To assign IP addresses to computers', 'To digitally sign and issue X.509 certificates that cryptographically bind public keys to identities', 'To store user bank account numbers', 'To monitor internet traffic routing'],
    correctAnswer: 1,
    explanation: 'A CA is a trusted third-party organization that validates identities and issues signed digital certificates.'
  },
  {
    questionNumber: 9,
    questionText: 'Which algorithm is a modern, widely accepted symmetric block cipher standard?',
    options: ['AES (Advanced Encryption Standard)', 'RSA', 'MD5', 'Diffie-Hellman'],
    correctAnswer: 0,
    explanation: 'AES is the global symmetric block cipher standard using 128, 192, or 256-bit keys.'
  },
  {
    questionNumber: 10,
    questionText: 'What is a Distributed Denial of Service (DDoS) attack?',
    options: ['Infecting a laptop with malware', 'Overwhelming a target network, server, or service with a flood of traffic originating from multiple compromised devices (botnet)', 'Brute-forcing an admin password', 'Physically disconnecting power generators'],
    correctAnswer: 1,
    explanation: 'DDoS employs botnets to flood target resources, rendering services unavailable to legitimate users.'
  },
  {
    questionNumber: 11,
    questionText: 'What does the HTTP header "Strict-Transport-Security" (HSTS) enforce?',
    options: ['Compresses HTTP traffic', 'Instructs compliant browsers to only communicate with the website over secure HTTPS connections, preventing SSL stripping', 'Blocks all JavaScript execution', 'Allows unrestricted cross-origin requests'],
    correctAnswer: 1,
    explanation: 'HSTS forces browsers to connect exclusively via HTTPS, defending against man-in-the-middle SSL stripping attacks.'
  },
  {
    questionNumber: 12,
    questionText: 'What is an Insecure Direct Object Reference (IDOR)?',
    options: ['A missing CSS stylesheet', 'A vulnerability where an application uses user-supplied input to access database objects directly without verifying authorization permissions', 'A broken pointer in C++', 'An invalid HTML image tag'],
    correctAnswer: 1,
    explanation: 'IDOR occurs when an application exposes a direct reference to an internal resource (e.g. /api/user/456) without verifying the caller\'s access rights.'
  },
  {
    questionNumber: 13,
    questionText: 'Which protocol operates on TCP port 443 and encrypts HTTP traffic via TLS?',
    options: ['FTP', 'SSH', 'HTTPS', 'Telnet'],
    correctAnswer: 2,
    explanation: 'HTTPS uses TLS to encrypt HTTP communications over port 443.'
  },
  {
    questionNumber: 14,
    questionText: 'What is the difference between an Intrusion Detection System (IDS) and an Intrusion Prevention System (IPS)?',
    options: ['IDS only monitors and alerts on suspicious traffic; IPS actively inspects in-line and drops/blocks malicious packets', 'IDS is hardware; IPS is always software', 'IDS protects against viruses only; IPS protects against phishing only', 'There is no difference'],
    correctAnswer: 0,
    explanation: 'IDS passively analyzes network packets and raises alerts, whereas IPS actively intervenes in real time to stop threats.'
  },
  {
    questionNumber: 15,
    questionText: 'What is Multi-Factor Authentication (MFA)?',
    options: ['Using multiple passwords on the same website', 'An authentication method requiring two or more distinct verification factors from different categories (Something you know, have, or are)', 'Typing your password twice', 'Logging into two devices at the same time'],
    correctAnswer: 1,
    explanation: 'MFA requires verification across multiple categories: Knowledge (password), Possession (authenticator app/token), or Inherence (biometrics).'
  },
  {
    questionNumber: 16,
    questionText: 'What is a "Zero-Day" vulnerability?',
    options: ['A vulnerability that takes zero days to fix', 'A security flaw known to attackers or researchers before the vendor has released an official security patch or fix', 'A software bug discovered on the 0th day of the month', 'An expired SSL certificate'],
    correctAnswer: 1,
    explanation: 'Zero-day vulnerabilities have no available vendor patch at the time of discovery/exploitation.'
  },
  {
    questionNumber: 17,
    questionText: 'What is the purpose of a Content Security Policy (CSP)?',
    options: ['To format blog content for mobile', 'An HTTP response header that restricts the resources (scripts, styles, images) browsers are allowed to load for a given page, mitigating XSS', 'To speed up video streaming', 'To backup website assets'],
    correctAnswer: 1,
    explanation: 'CSP is an effective defense-in-depth header designed to restrict authorized domains from executing scripts, preventing XSS.'
  },
  {
    questionNumber: 18,
    questionText: 'What is a Man-In-The-Middle (MITM) attack?',
    options: ['An attacker intercepting, reading, or altering communications between two parties who believe they are communicating directly with each other', 'A physical intruder entering a server room', 'A database collision error', 'A distributed Denial of Service attempt'],
    correctAnswer: 0,
    explanation: 'MITM involves an adversary eavesdropping or tampering with confidential communications between two endpoints.'
  },
  {
    questionNumber: 19,
    questionText: 'Why is MD5 considered insecure for password storage and digital signatures?',
    options: ['It requires too much CPU memory', 'It is susceptible to fast collision attacks where different inputs produce the exact same hash digest', 'It is an asymmetric algorithm', 'It can only hash numbers'],
    correctAnswer: 1,
    explanation: 'Cryptographic hash collisions have been proven practical for MD5, rendering it broken for security applications.'
  },
  {
    questionNumber: 20,
    questionText: 'What does the Principle of Least Privilege (PoLP) dictate?',
    options: ['Users should have maximum administrator privileges to prevent permission errors', 'Every user, process, or program should be granted only the minimum necessary privileges required to perform their intended duties', 'All servers should run in the cloud', 'Data must always be unencrypted on disk'],
    correctAnswer: 1,
    explanation: 'Least Privilege restricts access rights for every identity to the bare essentials required for their function.'
  },
  {
    questionNumber: 21,
    questionText: 'What is Phishing in social engineering?',
    options: ['Searching for files on a network drive', 'Deceptive communication (often emails or spoofed websites) mimicking trusted entities to lure victims into sharing credentials or sensitive data', 'Scanning open network ports with Nmap', 'Overclocking CPU processors'],
    correctAnswer: 1,
    explanation: 'Phishing tricks users into disclosing confidential information by impersonating legitimate organizations.'
  },
  {
    questionNumber: 22,
    questionText: 'What is the purpose of Port Scanning in security assessments?',
    options: ['To identify open network ports, active listening services, and operating system fingerprints on a host', 'To overclock network cards', 'To delete log files remotely', 'To purchase web domain names'],
    correctAnswer: 0,
    explanation: 'Port scanning probes target IP addresses to discover exposed services, versions, and potential entry points.'
  },
  {
    questionNumber: 23,
    questionText: 'What is a Buffer Overflow attack?',
    options: ['When video players buffer too slowly', 'An anomaly where a program writes data beyond the allocated boundary of a memory buffer, corrupting adjacent memory and enabling arbitrary code execution', 'Flooding a network router with UDP packets', 'An out-of-disk-space error on Linux'],
    correctAnswer: 1,
    explanation: 'Buffer overflows overwrite adjacent memory on the stack or heap to alter control flow and execute injected shellcode.'
  },
  {
    questionNumber: 24,
    questionText: 'What is Address Resolution Protocol (ARP) Poisoning/Spoofing?',
    options: ['Flooding web forms with malicious input', 'Sending forged ARP messages across a local area network to link an attacker\'s MAC address with the IP address of a legitimate default gateway', 'Injecting viruses via USB drives', 'Changing DNS server names'],
    correctAnswer: 1,
    explanation: 'ARP spoofing associates an attacker\'s MAC with the default gateway IP, enabling traffic interception on LANs.'
  },
  {
    questionNumber: 25,
    questionText: 'Which cookie attribute prevents client-side scripts (such as JavaScript via document.cookie) from accessing the cookie, mitigating session hijacking via XSS?',
    options: ['Secure', 'HttpOnly', 'SameSite=Lax', 'Domain'],
    correctAnswer: 1,
    explanation: 'HttpOnly prevents JavaScript from reading session cookies, thwarting XSS-based cookie theft.'
  },
  {
    questionNumber: 26,
    questionText: 'What is Ransomware?',
    options: ['Adware displaying pop-up advertisements', 'Malware that covertly encrypts victim files or systems, demanding ransom payments in exchange for decryption keys', 'A hardware monitoring tool', 'Software that updates operating systems'],
    correctAnswer: 1,
    explanation: 'Ransomware holds user data hostage through strong cryptography until extortion payments are transferred.'
  },
  {
    questionNumber: 27,
    questionText: 'What is the role of a Web Application Firewall (WAF)?',
    options: ['To filter and monitor HTTP traffic between a web application and the Internet, inspecting OSI Layer 7 payloads for malicious exploits', 'To route fiber optic cables', 'To format React components', 'To generate SSH key pairs'],
    correctAnswer: 0,
    explanation: 'A WAF operates at Layer 7 to inspect web traffic and filter common threats like SQLi, XSS, and bad bots.'
  },
  {
    questionNumber: 28,
    questionText: 'What is Honeypot in defensive cybersecurity?',
    options: ['A database containing encrypted passwords', 'A decoy system or network intentionally configured to attract, detect, and analyze unauthorized cyber-attackers', 'A tool for writing documentation', 'A high-speed network cable'],
    correctAnswer: 1,
    explanation: 'A honeypot is an isolated decoy system set up to lure attackers and study their tactics without endangering production systems.'
  },
  {
    questionNumber: 29,
    questionText: 'Which type of cryptographic algorithm is Diffie-Hellman?',
    options: ['Symmetric block cipher', 'Key-Exchange algorithm allowing two parties to establish a shared secret over an insecure channel', 'Stream cipher for video', 'Hash function'],
    correctAnswer: 1,
    explanation: 'Diffie-Hellman allows two parties with no prior shared secret to safely negotiate a shared symmetric key over an insecure medium.'
  },
  {
    questionNumber: 30,
    questionText: 'What does the term "Defense in Depth" signify in cybersecurity architecture?',
    options: ['Relying solely on one impenetrable perimeter firewall', 'Employing multiple layers of redundant defensive mechanisms (physical, network, host, application, data) so if one fails, others stop the adversary', 'Burying servers underground', 'Using passwords longer than 50 characters only'],
    correctAnswer: 1,
    explanation: 'Defense in Depth utilizes layered controls across all tiers to provide resilient defense against systemic failures.'
  }
];

const quizQuestions = [
  {
    questionNumber: 1,
    questionText: 'What does the "C" in the CIA triad stand for?',
    options: ['Cryptography', 'Confidentiality', 'Cybernetics', 'Control'],
    correctAnswer: 1,
    explanation: 'Confidentiality ensures that information is not disclosed to unauthorized individuals or processes.'
  },
  {
    questionNumber: 2,
    questionText: 'Which default port is used by unencrypted HTTP web traffic?',
    options: ['21', '80', '443', '22'],
    correctAnswer: 1,
    explanation: 'HTTP traffic communicates over TCP port 80 by default.'
  },
  {
    questionNumber: 3,
    questionText: 'Which port is standard for secure shell (SSH) remote administrative access?',
    options: ['22', '25', '53', '110'],
    correctAnswer: 0,
    explanation: 'SSH operates over TCP port 22.'
  },
  {
    questionNumber: 4,
    questionText: 'What is malware designed to record keystrokes entered on a computer called?',
    options: ['Rootkit', 'Keylogger', 'Trojan Horse', 'Worm'],
    correctAnswer: 1,
    explanation: 'Keyloggers covertly log keystrokes to capture usernames, passwords, and sensitive information.'
  },
  {
    questionNumber: 5,
    questionText: 'Is plain-text password storage acceptable in production web applications?',
    options: ['Yes, if the database has a password', 'No, passwords must always be securely salted and hashed using algorithms like bcrypt or Argon2', 'Only for admin accounts', 'Yes, for testing purposes'],
    correctAnswer: 1,
    explanation: 'Storing plain-text passwords is a severe security violation; they must always be salted and hashed.'
  },
  {
    questionNumber: 6,
    questionText: 'What does VPN stand for?',
    options: ['Virtual Private Network', 'Visual Protection Node', 'Verified Protocol Name', 'Vector Processing Network'],
    correctAnswer: 0,
    explanation: 'VPN stands for Virtual Private Network, establishing an encrypted tunnel over public networks.'
  },
  {
    questionNumber: 7,
    questionText: 'Which tool is famous for network packet analysis and packet capturing?',
    options: ['Wireshark', 'Photoshop', 'Excel', 'VLC Player'],
    correctAnswer: 0,
    explanation: 'Wireshark is the world\'s foremost open-source network protocol analyzer.'
  },
  {
    questionNumber: 8,
    questionText: 'What is a "Trojan Horse" in computer security?',
    options: ['A harmless antivirus update', 'Malware disguised as legitimate or useful software to trick users into installing it', 'A fast networking cable', 'A strong encryption key'],
    correctAnswer: 1,
    explanation: 'A Trojan misrepresents itself as benign software to induce the user into executing it.'
  },
  {
    questionNumber: 9,
    questionText: 'What type of hacker uses their skills defensively within legal authorization to improve security?',
    options: ['Black Hat Hacker', 'White Hat / Ethical Hacker', 'Script Kiddie', 'Grey Hat Hacker'],
    correctAnswer: 1,
    explanation: 'White Hat (ethical) hackers test and strengthen systems with explicit permission.'
  },
  {
    questionNumber: 10,
    questionText: 'What is the main danger of using public, unencrypted Wi-Fi hotspots?',
    options: ['Your battery drains faster', 'Eavesdroppers on the same network can intercept unencrypted network traffic and session data', 'The screen resolution drops', 'Hard drives become fragmented'],
    correctAnswer: 1,
    explanation: 'Open Wi-Fi allows adjacent network users to monitor packet traffic and launch MITM attacks.'
  },
  {
    questionNumber: 11,
    questionText: 'Which security principle requires verifying every access request regardless of location?',
    options: ['Zero Trust Architecture', 'Trust but Verify', 'Open Door Policy', 'Perimeter Castle Approach'],
    correctAnswer: 0,
    explanation: 'Zero Trust assumes breach and requires continuous verification for all users, devices, and workloads.'
  },
  {
    questionNumber: 12,
    questionText: 'Which command line tool is commonly used to test network connectivity to a remote host using ICMP echo requests?',
    options: ['traceroute', 'ping', 'netstat', 'ipconfig'],
    correctAnswer: 1,
    explanation: 'The ping utility sends ICMP Echo Request packets to test host reachability.'
  },
  {
    questionNumber: 13,
    questionText: 'What is Social Engineering in information security?',
    options: ['Writing software in social media teams', 'Manipulating people psychologically into performing actions or divulging confidential information', 'Building computers from scratch', 'Analyzing social network algorithms'],
    correctAnswer: 1,
    explanation: 'Social engineering exploits human psychology rather than software vulnerabilities.'
  },
  {
    questionNumber: 14,
    questionText: 'Which hash function produces a 256-bit fixed-length output?',
    options: ['SHA-256', 'MD5', 'CRC32', 'DES'],
    correctAnswer: 0,
    explanation: 'SHA-256 generates a 256-bit (32-byte) cryptographic hash digest.'
  },
  {
    questionNumber: 15,
    questionText: 'What is the function of a digital signature?',
    options: ['To sign PDF files with a physical pen', 'To provide cryptographic authentication of source, non-repudiation, and message integrity', 'To compress text documents', 'To hide the sender\'s email address'],
    correctAnswer: 1,
    explanation: 'Digital signatures verify the sender\'s authenticity and guarantee that data has not been modified.'
  },
  {
    questionNumber: 16,
    questionText: 'What does "DDoS" stand for?',
    options: ['Direct Database Operating System', 'Distributed Denial of Service', 'Domain Data Output Security', 'Digital Delivery of Software'],
    correctAnswer: 1,
    explanation: 'DDoS stands for Distributed Denial of Service.'
  },
  {
    questionNumber: 17,
    questionText: 'What is an example of biometric authentication?',
    options: ['Password', 'Smartcard', 'Fingerprint or Facial recognition scan', 'Security pin number'],
    correctAnswer: 2,
    explanation: 'Biometrics utilize physiological characteristics such as fingerprints, retinas, or facial geometry.'
  },
  {
    questionNumber: 18,
    questionText: 'Which HTTP cookie attribute ensures cookies are only transmitted over encrypted (HTTPS) connections?',
    options: ['HttpOnly', 'Secure', 'Path', 'Expires'],
    correctAnswer: 1,
    explanation: 'The Secure flag directs browsers to never send the cookie over unencrypted HTTP channels.'
  },
  {
    questionNumber: 19,
    questionText: 'What is a "Botnet"?',
    options: ['A website for buying robots', 'A network of private computers infected with malicious software and controlled as a group without the owners\' knowledge', 'An AI chat application', 'A high-speed router cluster'],
    correctAnswer: 1,
    explanation: 'A botnet consists of compromised internet-connected devices commanded by a botmaster.'
  },
  {
    questionNumber: 20,
    questionText: 'Why should you always keep software and operating systems updated with latest patches?',
    options: ['To change the desktop wallpaper', 'To remediate known security vulnerabilities and protect against newly emerging exploits', 'To free up 100% of RAM memory', 'To delete temporary browser cache'],
    correctAnswer: 1,
    explanation: 'Patch updates close documented security vulnerabilities that attackers actively seek to exploit.'
  }
];

module.exports = { assessmentQuestions, quizQuestions };
