// 30 Assessment Questions & 20 Quiz Questions for Cloud Computing
const assessmentQuestions = [
  {
    questionNumber: 1,
    questionText: 'What are the three fundamental cloud computing service models defined by NIST?',
    options: ['Public, Private, Hybrid', 'IaaS (Infrastructure), PaaS (Platform), SaaS (Software)', 'Compute, Storage, Networking', 'AWS, Azure, GCP'],
    correctAnswer: 1,
    explanation: 'NIST defines three primary service models: Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS).'
  },
  {
    questionNumber: 2,
    questionText: 'What is the key difference between a Virtual Machine (VM) and a Docker Container?',
    options: ['Containers virtualize the operating system kernel and share host OS resources, while VMs virtualize entire hardware including guest OS', 'VMs start faster than containers', 'Containers can only run Windows', 'VMs do not use hypervisors'],
    correctAnswer: 0,
    explanation: 'Containers share the host operating system kernel, making them lightweight and fast to spin up compared to full-OS hypervisor VMs.'
  },
  {
    questionNumber: 3,
    questionText: 'Under the Cloud Shared Responsibility Model, which layer is ALWAYS the customer\'s responsibility across IaaS, PaaS, and SaaS?',
    options: ['Physical data center security', 'Customer Data, Access Management (IAM), and Credentials', 'Hypervisor maintenance', 'Server hardware rack cooling'],
    correctAnswer: 1,
    explanation: 'Customers always retain full responsibility for securing their own data, classification, and access policies.'
  },
  {
    questionNumber: 4,
    questionText: 'What is an "Availability Zone" (AZ) in AWS or cloud architecture?',
    options: ['A geographic continent', 'One or more discrete data centers with redundant power, networking, and connectivity within a Region', 'A software licensing tier', 'A domain name registrar'],
    correctAnswer: 1,
    explanation: 'An Availability Zone consists of one or more physical data centers isolated from failures in other AZs within the same geographic Region.'
  },
  {
    questionNumber: 5,
    questionText: 'What is the smallest deployable compute unit in a Kubernetes cluster?',
    options: ['Node', 'Cluster', 'Pod', 'Namespace'],
    correctAnswer: 2,
    explanation: 'A Pod is the basic execution unit in Kubernetes, hosting one or more tightly coupled containers.'
  },
  {
    questionNumber: 6,
    questionText: 'What does "Elasticity" mean in cloud computing?',
    options: ['The physical flexibility of server racks', 'The ability of a system to dynamically allocate and deallocate computing resources automatically to match real-time workload demands', 'Paying a fixed flat fee every decade', 'Using optical fiber networking cables'],
    correctAnswer: 1,
    explanation: 'Elasticity is the capability to expand or shrink infrastructure automatically in response to varying load.'
  },
  {
    questionNumber: 7,
    questionText: 'Which AWS service provides serverless compute where you run code without provisioning or managing servers?',
    options: ['Amazon EC2', 'Amazon S3', 'AWS Lambda', 'Amazon RDS'],
    correctAnswer: 2,
    explanation: 'AWS Lambda lets you run code in response to events and automatically scales execution to zero.'
  },
  {
    questionNumber: 8,
    questionText: 'What type of storage is Amazon S3 (Simple Storage Service)?',
    options: ['Block Storage', 'Relational Database Storage', 'Object Storage with flat hierarchy and REST API access', 'Local SSD ephemeral cache'],
    correctAnswer: 2,
    explanation: 'Amazon S3 is scalable object storage storing files and metadata accessible via HTTP/REST.'
  },
  {
    questionNumber: 9,
    questionText: 'What is the purpose of Kubernetes "etcd"?',
    options: ['A load balancer for HTTP traffic', 'A consistent and highly-available key-value store used as Kubernetes\' backing store for all cluster state data', 'A container image registry', 'A user dashboard GUI'],
    correctAnswer: 1,
    explanation: 'etcd is the distributed key-value store holding the complete state and configuration of a Kubernetes cluster.'
  },
  {
    questionNumber: 10,
    questionText: 'What is "Horizontal Pod Autoscaling" (HPA) in Kubernetes?',
    options: ['Increasing the RAM size of individual worker nodes', 'Automatically scaling the number of pod replicas up or down based on observed CPU utilization or custom metrics', 'Moving containers to another data center', 'Deleting old log files'],
    correctAnswer: 1,
    explanation: 'HPA adjusts the number of replica pods running a workload based on resource utilization metrics.'
  },
  {
    questionNumber: 11,
    questionText: 'What is Infrastructure as Code (IaC)?',
    options: ['Writing code on physical servers with pens', 'Managing and provisioning cloud and computing infrastructure through machine-readable definition files (e.g. Terraform, CloudFormation)', 'Converting C++ to Python', 'Building server motherboards manually'],
    correctAnswer: 1,
    explanation: 'IaC manages infrastructure using version-controlled configuration files rather than manual point-and-click console configuration.'
  },
  {
    questionNumber: 12,
    questionText: 'What is a Virtual Private Cloud (VPC)?',
    options: ['A computer stored in a home basement', 'A logically isolated virtual network dedicated to your cloud account within a public cloud provider', 'A commercial software package', 'A public web browser'],
    correctAnswer: 1,
    explanation: 'A VPC enables provisioning a private, isolated virtual network topology complete with subnets, route tables, and gateways.'
  },
  {
    questionNumber: 13,
    questionText: 'What is the primary role of the Kubernetes Kubelet component?',
    options: ['An agent running on each worker node that ensures containers are running in pods as specified in PodSpecs', 'The central API gateway in the cloud', 'A DNS server for web domains', 'A code compiler for Dockerfiles'],
    correctAnswer: 0,
    explanation: 'The Kubelet agent runs on each node and communicates with the control plane to run and monitor containers.'
  },
  {
    questionNumber: 14,
    questionText: 'Which AWS service is a managed relational database service supporting MySQL, PostgreSQL, and Oracle?',
    options: ['Amazon DynamoDB', 'Amazon RDS (Relational Database Service)', 'Amazon Redshift', 'Amazon ElastiCache'],
    correctAnswer: 1,
    explanation: 'Amazon RDS manages provisioning, patching, backup, recovery, and scaling for relational database engines.'
  },
  {
    questionNumber: 15,
    questionText: 'What is a Content Delivery Network (CDN) like Amazon CloudFront or Cloudflare?',
    options: ['A network of physically distributed edge caching servers that deliver content rapidly to users based on geographic proximity', 'A fiber cable beneath oceans', 'A database for storing videos', 'A programming language'],
    correctAnswer: 0,
    explanation: 'CDNs cache static and dynamic web content at edge locations worldwide to minimize latency for end users.'
  },
  {
    questionNumber: 16,
    questionText: 'What is the function of a Cloud Load Balancer?',
    options: ['To distribute incoming application traffic evenly across multiple healthy target instances or containers to maximize throughput and fault tolerance', 'To balance electricity between power outlets', 'To compress images before upload', 'To store passwords in memory'],
    correctAnswer: 0,
    explanation: 'Load balancers distribute network traffic across compute targets to optimize availability and avoid single points of failure.'
  },
  {
    questionNumber: 17,
    questionText: 'What does "Multi-Tenancy" mean in cloud architecture?',
    options: ['Renting ten apartments at once', 'A software architecture where a single instance of software or shared physical infrastructure serves multiple independent customers (tenants)', 'Having multiple CPU cores in a laptop', 'A database with ten tables'],
    correctAnswer: 1,
    explanation: 'Multi-tenancy allows cloud providers to pool hardware resources efficiently among isolated tenant workloads.'
  },
  {
    questionNumber: 18,
    questionText: 'What is a Dockerfile?',
    options: ['A compressed ZIP archive of source code', 'A plain text script containing ordered instructions and commands used to automatically build a Docker container image', 'A log file generated by Kubernetes', 'A network socket configuration'],
    correctAnswer: 1,
    explanation: 'A Dockerfile defines the base image, environment, dependencies, and startup command for container images.'
  },
  {
    questionNumber: 19,
    questionText: 'What is "Cold Start" in serverless functions (like AWS Lambda)?',
    options: ['Turning on a computer in a cold room', 'The latency delay experienced when a function is invoked after being idle, requiring the platform to spin up a new container runtime container', 'A failed deployment error', 'An unhandled exception in code'],
    correctAnswer: 1,
    explanation: 'A cold start is the initialization overhead required when cloud platforms allocate and initialize new runtime environments.'
  },
  {
    questionNumber: 20,
    questionText: 'What is the role of Kubernetes Ingress?',
    options: ['To manage external HTTP/HTTPS routing and traffic ingress into services within the cluster', 'To compile TypeScript into JavaScript', 'To encrypt hard drives in worker nodes', 'To delete inactive pods'],
    correctAnswer: 0,
    explanation: 'Ingress exposes HTTP and HTTPS routes from outside the cluster to services within the cluster.'
  },
  {
    questionNumber: 21,
    questionText: 'Which cloud deployment model combines on-premises private infrastructure with public cloud resources?',
    options: ['Public Cloud', 'Private Cloud', 'Hybrid Cloud', 'Community Cloud'],
    correctAnswer: 2,
    explanation: 'Hybrid cloud integrates on-premise private clouds with public clouds for unified data and application portability.'
  },
  {
    questionNumber: 22,
    questionText: 'What is the benefit of multi-stage Docker builds?',
    options: ['They compile code on three different computers', 'They produce drastically smaller, more secure production container images by separating build-time tools from runtime artifacts', 'They make containers boot in reverse order', 'They automatically write unit tests'],
    correctAnswer: 1,
    explanation: 'Multi-stage builds eliminate compilers and build tools from the final container artifact, reducing image size and attack surface.'
  },
  {
    questionNumber: 23,
    questionText: 'What is the purpose of an IAM (Identity and Access Management) Role in AWS?',
    options: ['A username for logging into personal emails', 'An identity with permission policies that can be temporarily assumed by authorized services, applications, or users without long-term credentials', 'A physical key card for entering server rooms', 'A billing tier'],
    correctAnswer: 1,
    explanation: 'IAM Roles provide short-lived temporary security credentials for workloads requiring AWS service permissions.'
  },
  {
    questionNumber: 24,
    questionText: 'What does "Disaster Recovery RTO" (Recovery Time Objective) measure?',
    options: ['The maximum acceptable amount of data loss measured in time', 'The maximum acceptable duration of system downtime before business operations must be restored', 'The speed of hard disk backups', 'The cost of cloud subscriptions'],
    correctAnswer: 1,
    explanation: 'RTO defines the target duration within which a business process must be restored following an incident.'
  },
  {
    questionNumber: 25,
    questionText: 'What is the role of a Service Mesh (e.g. Istio) in microservices architecture?',
    options: ['A physical cable connecting server racks', 'A dedicated infrastructure layer for managing service-to-service communication, mTLS encryption, observability, and traffic routing', 'A database for graph relationships', 'A UI design system'],
    correctAnswer: 1,
    explanation: 'A service mesh manages microservice network communications using sidecar proxies for security, routing, and telemetry.'
  },
  {
    questionNumber: 26,
    questionText: 'What does "Blue-Green Deployment" achieve in modern DevOps?',
    options: ['Testing code on blue and green monitors', 'Zero-downtime releases by running two identical environments where one serves live traffic while the other is updated before switching traffic instantly', 'Deploying only on weekends', 'Reverting all Git commits'],
    correctAnswer: 1,
    explanation: 'Blue-Green deployments minimize risk and downtime by routing router traffic between two production-identical environments.'
  },
  {
    questionNumber: 27,
    questionText: 'What is Amazon DynamoDB?',
    options: ['A relational SQL database', 'A fully managed serverless NoSQL key-value and document database offering single-digit millisecond latency at any scale', 'A virtual machine instance type', 'A file compression utility'],
    correctAnswer: 1,
    explanation: 'Amazon DynamoDB is a fast, highly scalable managed NoSQL database service.'
  },
  {
    questionNumber: 28,
    questionText: 'In Kubernetes, what controller ensures that a specified number of identical pod replicas are running at all times?',
    options: ['ReplicaSet', 'Namespace', 'ConfigMap', 'DaemonJob'],
    correctAnswer: 0,
    explanation: 'A ReplicaSet maintains a stable set of replica Pods running at any given time.'
  },
  {
    questionNumber: 29,
    questionText: 'What is "Chaos Engineering" in cloud systems (e.g. Netflix Chaos Monkey)?',
    options: ['Randomly writing code without formatting', 'The discipline of experimenting on a distributed software system in production to build confidence in the system\'s capability to withstand turbulent disruptions', 'Deleting source code repositories', 'Using insecure passwords'],
    correctAnswer: 1,
    explanation: 'Chaos Engineering injects intentional faults to proactively detect weaknesses before outages occur.'
  },
  {
    questionNumber: 30,
    questionText: 'What is an AWS CloudFormation or Terraform template?',
    options: ['A PowerPoint presentation for executives', 'A declarative configuration file describing all desired cloud resources and dependencies for automated provisioning', 'A graphic user interface theme', 'A database SQL dump'],
    correctAnswer: 1,
    explanation: 'CloudFormation/Terraform templates define cloud infrastructure declaratively in YAML or JSON.'
  }
];

const quizQuestions = [
  {
    questionNumber: 1,
    questionText: 'What does "SaaS" stand for in cloud computing?',
    options: ['Software as a Service', 'Storage as a Service', 'System and Application Software', 'Security as a Standard'],
    correctAnswer: 0,
    explanation: 'SaaS stands for Software as a Service.'
  },
  {
    questionNumber: 2,
    questionText: 'Which company created the popular containerization platform Docker?',
    options: ['Google', 'Docker, Inc.', 'Microsoft', 'Amazon'],
    correctAnswer: 1,
    explanation: 'Docker was created by Solomon Hykes and launched by Docker, Inc.'
  },
  {
    questionNumber: 3,
    questionText: 'Which open-source container orchestration system was originally designed by Google?',
    options: ['Mesos', 'Kubernetes', 'Swarm', 'Nomad'],
    correctAnswer: 1,
    explanation: 'Kubernetes (K8s) was developed by Google and later donated to the Cloud Native Computing Foundation (CNCF).'
  },
  {
    questionNumber: 4,
    questionText: 'What is the command to list all running Docker containers in a terminal?',
    options: ['docker show', 'docker ps', 'docker list', 'docker status'],
    correctAnswer: 1,
    explanation: '"docker ps" lists all actively running containers.'
  },
  {
    questionNumber: 5,
    questionText: 'Which AWS service is used to provision virtual servers in the cloud?',
    options: ['Amazon S3', 'Amazon EC2 (Elastic Compute Cloud)', 'Amazon CloudWatch', 'Amazon Route 53'],
    correctAnswer: 1,
    explanation: 'Amazon EC2 provides scalable compute capacity in the cloud.'
  },
  {
    questionNumber: 6,
    questionText: 'What is the default command-line utility used to interact with a Kubernetes cluster?',
    options: ['dockercfg', 'kubectl', 'k8s-cli', 'kube-manage'],
    correctAnswer: 1,
    explanation: 'kubectl is the standard CLI tool for controlling Kubernetes clusters.'
  },
  {
    questionNumber: 7,
    questionText: 'Which cloud deployment model is owned and operated exclusively for a single organization?',
    options: ['Public Cloud', 'Private Cloud', 'Community Cloud', 'Shared Cloud'],
    correctAnswer: 1,
    explanation: 'A Private Cloud is dedicated solely to one organization, hosted on-premises or by a third party.'
  },
  {
    questionNumber: 8,
    questionText: 'What is the pricing model commonly associated with cloud computing resources?',
    options: ['Pay-as-you-go (Utility computing)', 'Fixed lifetime upfront fee', 'Free for commercial enterprises', 'Barter system'],
    correctAnswer: 0,
    explanation: 'Cloud computing uses a pay-as-you-go model where customers pay only for consumed compute, storage, and network.'
  },
  {
    questionNumber: 9,
    questionText: 'What is the standard Docker command to build an image from a Dockerfile in the current directory?',
    options: ['docker create .', 'docker make -t myimage .', 'docker build -t myimage .', 'docker run .'],
    correctAnswer: 2,
    explanation: '"docker build -t <tag> ." builds an image from the Dockerfile in the current context.'
  },
  {
    questionNumber: 10,
    questionText: 'Which AWS service manages Domain Name System (DNS) routing?',
    options: ['Amazon Route 53', 'Amazon CloudFront', 'Amazon VPC', 'Amazon SNS'],
    correctAnswer: 0,
    explanation: 'Amazon Route 53 is a highly available and scalable cloud DNS web service.'
  },
  {
    questionNumber: 11,
    questionText: 'What is the benefit of Cloud Object Storage over traditional block storage?',
    options: ['Virtually unlimited scalability and flat metadata-driven architecture accessible via HTTP/REST APIs', 'Directly bootable by bare-metal BIOS', 'Cannot store images', 'Requires physical floppy drives'],
    correctAnswer: 0,
    explanation: 'Object storage scales indefinitely for unstructured data with rich metadata accessed over HTTP.'
  },
  {
    questionNumber: 12,
    questionText: 'In Kubernetes, what resource manages environment-specific configuration keys and values separately from container code?',
    options: ['Secret', 'ConfigMap', 'DaemonSet', 'Ingress'],
    correctAnswer: 1,
    explanation: 'ConfigMaps decouple environment-specific configuration artifacts from container image content.'
  },
  {
    questionNumber: 13,
    questionText: 'What does "IaaS" stand for?',
    options: ['Internet as a Service', 'Infrastructure as a Service', 'Interface and Application Standard', 'Integrated Architecture Server'],
    correctAnswer: 1,
    explanation: 'IaaS stands for Infrastructure as a Service.'
  },
  {
    questionNumber: 14,
    questionText: 'Which container registry is the default public hub for sharing Docker images?',
    options: ['GitHub Releases', 'Docker Hub', 'npm Registry', 'AWS Marketplace'],
    correctAnswer: 1,
    explanation: 'Docker Hub is the default public cloud repository for finding and sharing container images.'
  },
  {
    questionNumber: 15,
    questionText: 'What is an "Auto Scaling Group" in cloud infrastructure?',
    options: ['A group of administrators sharing passwords', 'A collection of virtual instances that automatically adjusts its capacity according to defined scaling policies', 'An automatic software compiler', 'A backup hard disk'],
    correctAnswer: 1,
    explanation: 'Auto Scaling automatically maintains application availability by scaling compute capacity.'
  },
  {
    questionNumber: 16,
    questionText: 'What is the function of AWS CloudWatch?',
    options: ['To display the local time in Seattle', 'A monitoring and observability service providing metrics, alarms, and log collection for cloud resources', 'A video streaming platform', 'A database migration engine'],
    correctAnswer: 1,
    explanation: 'Amazon CloudWatch monitors applications and infrastructure, collecting metrics and triggering alarms.'
  },
  {
    questionNumber: 17,
    questionText: 'What happens to files written to non-persistent ephemeral storage on a container when the container crashes and restarts?',
    options: ['They are permanently preserved on tape', 'They are lost because ephemeral container layers are destroyed upon container termination', 'They are emailed to the administrator', 'They move to the cloud root folder'],
    correctAnswer: 1,
    explanation: 'Containers are ephemeral; non-volume local storage is wiped when a container stops.'
  },
  {
    questionNumber: 18,
    questionText: 'What is a "Serverless" architecture?',
    options: ['Applications running without any physical computers in the world', 'An execution model where the cloud provider manages server allocation, scaling, and maintenance, charging only for executed compute time', 'Writing code using pen and paper', 'Peer-to-peer torrent networking only'],
    correctAnswer: 1,
    explanation: 'Serverless abstracts server management away from developers, providing on-demand execution and event-based billing.'
  },
  {
    questionNumber: 19,
    questionText: 'Which Kubernetes object represents a sensitive string like a database password or API token?',
    options: ['Secret', 'ConfigMap', 'Pod', 'ServiceAccount'],
    correctAnswer: 0,
    explanation: 'Kubernetes Secrets let you store and manage sensitive information such as passwords and keys securely.'
  },
  {
    questionNumber: 20,
    questionText: 'What is "Multi-Cloud" strategy in modern IT enterprises?',
    options: ['Looking at clouds on rainy days', 'Distributing workloads and services across multiple distinct cloud providers (e.g. AWS, Azure, GCP) to avoid vendor lock-in and optimize costs', 'Using only one local computer', 'Running twenty web browsers simultaneously'],
    correctAnswer: 1,
    explanation: 'Multi-Cloud leverages multiple public cloud vendors to avoid vendor lock-in and increase resilience.'
  }
];

module.exports = { assessmentQuestions, quizQuestions };
