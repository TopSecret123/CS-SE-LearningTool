const MODULE3 = {
  id: 'mod3',
  title: 'Network & Transport Layers',
  week: 3,
  dateRange: '18–24 May 2026',
  summary: 'How devices are addressed, how data moves end-to-end, and how routers find the best path.',

  // ─── TOPICS ────────────────────────────────────────────────────────────────
  topics: [
    {
      id: 'topic1',
      title: 'Network & Transport Layers',
      duration: '~60 min',
      sections: [
        {
          id: 't1-s1',
          number: '01',
          title: 'Addressing',
          duration: '10 min',
          content: {
            diagram: {
              label: 'IPv4 address structure',
              parts: [
                { value: '192', type: 'network' },
                { value: '168', type: 'network' },
                { value: '1',   type: 'host' },
                { value: '42',  type: 'host' },
              ],
              suffix: '/ 16',
              legend: [
                { type: 'network', label: 'Network portion' },
                { type: 'host',    label: 'Host portion' },
              ]
            },
            cards: [
              { label: 'IPv4',         body: '32-bit · ~4.3 billion addresses · dotted decimal (x.x.x.x)',          accent: 'blue'   },
              { label: 'IPv6',         body: '128-bit · 3.4×10³⁸ addresses · colon hex (x:x:x:x:x:x:x:x)',        accent: 'green'  },
              { label: 'Port numbers', body: 'Identify apps, not devices. :80=HTTP :443=HTTPS :22=SSH :53=DNS',      accent: 'orange' },
              { label: 'NAT',          body: 'Maps many private IPs to one public IP — extends IPv4 lifespan',      accent: 'purple' },
            ],
            note: 'IP address = device location. Port = which application. Think: IP is the building address, port is the apartment number.',
          }
        },
        {
          id: 't1-s2',
          number: '02',
          title: 'Networks & Subnets',
          duration: '7 min',
          content: {
            table: {
              headers: ['Class', 'Range', 'Default Mask', 'Use'],
              rows: [
                ['A', '0–127.x.x.x',   '/8',  'Very large networks'],
                ['B', '128–191.x.x.x', '/16', 'Medium networks'],
                ['C', '192–223.x.x.x', '/24', 'Small networks'],
              ]
            },
            cards: [
              { label: 'Subnet mask', body: 'Defines which bits are network vs host. /24 = 255.255.255.0', accent: 'blue'   },
              { label: 'CIDR',        body: 'Classless Inter-Domain Routing — replaces rigid class system, allows /18, /22 etc.', accent: 'green' },
            ],
            note: 'Subnetting divides a large network into smaller logical segments — improves security and reduces broadcast traffic.',
          }
        },
        {
          id: 't1-s3',
          number: '03',
          title: 'IPv6',
          duration: '10 min',
          content: {
            diagram: {
              label: 'IPv6 address example',
              ipv6Example: '2001:0db8:85a3::8a2e:0370:7334',
              ipv6Note: ':: means consecutive zero groups are collapsed',
            },
            bullets: [
              'Why needed: IPv4 address exhaustion (~4.3B addresses used up)',
              '128-bit = virtually unlimited addresses',
              'Built-in security (IPsec mandatory), better QoS headers',
              'No NAT needed — every device gets a globally unique address',
              'Transition: dual-stack (run IPv4 + IPv6 simultaneously)',
            ],
            tags: [
              { label: '128-bit',          type: 'default' },
              { label: 'IPsec built-in',   type: 'green'   },
              { label: 'No NAT',           type: 'green'   },
              { label: 'Dual-stack transition', type: 'orange' },
            ]
          }
        },
        {
          id: 't1-s4',
          number: '04',
          title: 'Address Resolution (ARP)',
          duration: '9 min',
          content: {
            flow: {
              label: 'ARP flow — IP → MAC',
              steps: [
                { label: 'Device A',   sub: 'knows: 192.168.1.5', type: 'default' },
                { label: '→' },
                { label: 'Broadcast',  sub: '"Who has .1.5?"',     type: 'orange'  },
                { label: '→' },
                { label: 'Device B',   sub: 'replies: MAC aa:bb:cc...', type: 'green' },
              ]
            },
            bullets: [
              'ARP translates Layer 3 (IP) → Layer 2 (MAC)',
              'Needed because switches forward using MAC, not IP',
              'ARP cache stores recent mappings to avoid repeated broadcasts',
              'ARP spoofing = security risk (attacker poisons cache)',
            ]
          }
        },
        {
          id: 't1-s5',
          number: '05',
          title: 'TCP — Transmission Control Protocol',
          duration: '16 min',
          content: {
            flow: {
              label: 'Three-way handshake',
              steps: [
                { label: 'Client', sub: '',          type: 'default' },
                { label: '── SYN ──→' },
                { label: 'Server', sub: '',          type: 'green'   },
              ],
              extraRows: [
                [
                  { label: 'Client', type: 'default' },
                  { label: '←── SYN-ACK ──' },
                  { label: 'Server', type: 'green'  },
                ],
                [
                  { label: 'Client', type: 'default' },
                  { label: '── ACK ──→' },
                  { label: 'Server', type: 'green'  },
                ],
              ]
            },
            cards: [
              { label: 'Segmentation',      body: 'Large data split into numbered segments, reassembled at destination', accent: 'blue'   },
              { label: 'Reliability',        body: 'Each segment ACKed. Lost segments are retransmitted.',                accent: 'green'  },
              { label: 'Flow control',       body: 'Sliding window limits how much data is in-flight at once',            accent: 'orange' },
              { label: 'Congestion control', body: 'Slow start + AIMD backs off when network is congested',               accent: 'purple' },
            ],
            tags: [
              { label: 'Connection-oriented', type: 'default' },
              { label: 'Reliable',             type: 'green'   },
              { label: 'Ordered delivery',     type: 'green'   },
              { label: 'Higher overhead',      type: 'orange'  },
            ]
          }
        },
        {
          id: 't1-s6',
          number: '06',
          title: 'UDP — User Datagram Protocol',
          duration: '3 min',
          content: {
            compare: [
              { side: 'left',  heading: 'TCP', body: 'Reliable, ordered, connection-oriented. Slower. HTTP, email, file transfer.' },
              { side: 'right', heading: 'UDP', body: 'Fast, connectionless, no guarantees. Lower overhead. DNS, video streaming, gaming, VoIP.' },
            ],
            bullets: [
              'No handshake, no ACKs, no retransmission',
              'Application handles reliability if needed (e.g. QUIC over UDP)',
              'Preferred when latency matters more than perfect delivery',
            ],
            tags: [
              { label: 'Connectionless',          type: 'default' },
              { label: 'Low latency',              type: 'green'   },
              { label: 'No guaranteed delivery',   type: 'orange'  },
            ]
          }
        },
        {
          id: 't1-s7',
          number: '07',
          title: 'Quality of Service & Net Neutrality',
          duration: '9 min',
          content: {
            cards: [
              { label: 'QoS',          body: 'Prioritise packet types — e.g. VoIP over bulk download — to reduce latency', accent: 'blue'   },
              { label: 'DiffServ',     body: 'Differentiated services field in IP header marks packet priority class',       accent: 'orange' },
              { label: 'Net neutrality', body: 'Principle that ISPs must treat all traffic equally — no throttling or paid priority', accent: 'green' },
            ],
            note: 'QoS is a technical mechanism. Net neutrality is the regulatory debate about whether ISPs should be allowed to use it commercially — e.g. charging Netflix extra for fast lanes.',
          }
        },
      ]
    },
    {
      id: 'topic2',
      title: 'IP Routing',
      duration: '~60 min',
      sections: [
        {
          id: 't2-s1',
          number: '01',
          title: 'Recap: TCP Segmentation',
          duration: '4 min',
          content: {
            flow: {
              label: 'Data encapsulation across layers',
              steps: [
                { label: 'App data',      type: 'default' },
                { label: '→' },
                { label: '+ TCP header',  sub: '= Segment', type: 'orange'  },
                { label: '→' },
                { label: '+ IP header',   sub: '= Packet',  type: 'green'   },
                { label: '→' },
                { label: '+ Frame header',sub: '= Frame',   type: 'default' },
              ]
            },
            bullets: [
              'Each layer wraps data with its own header (encapsulation)',
              'TCP segment = TCP header + app data (seq no., port, flags, checksum)',
              'Receiver strips each header and reassembles segments in order',
            ]
          }
        },
        {
          id: 't2-s2',
          number: '02',
          title: 'The Network Layer: Routing',
          duration: '19 min',
          content: {
            cards: [
              { label: 'Routing table',  body: 'Maps destination networks to next-hop router and outgoing interface',    accent: 'blue'   },
              { label: 'Hop-by-hop',     body: 'Each router only decides the next step — no router knows the full path', accent: 'green'  },
              { label: 'Static routing', body: 'Admin manually configures routes — simple but doesn\'t adapt to failures', accent: 'orange' },
              { label: 'Dynamic routing',body: 'Routers share info and auto-update tables using protocols like RIP or OSPF', accent: 'purple' },
            ],
            note: 'Routers operate at Layer 3. They read the destination IP, look up the routing table, and forward to the next hop. Switches (Layer 2) use MAC addresses for local delivery.',
          }
        },
        {
          id: 't2-s3',
          number: '03',
          title: 'Distance Vector: RIP',
          duration: '7 min',
          content: {
            highlight: {
              heading: 'Distance Vector Algorithm',
              body: 'Each router shares its routing table with direct neighbours only. Routes are measured in hops. Best path = fewest hops. Updates sent periodically.',
              accent: 'orange'
            },
            cards: [
              { label: 'RIP metric',       body: 'Hop count — max 15 hops (16 = unreachable). Simple but ignores link speed.', accent: 'blue'   },
              { label: 'Slow convergence', body: 'Takes many update cycles to propagate a failure — "count to infinity" problem', accent: 'orange' },
            ],
            tags: [
              { label: 'Bellman-Ford algorithm', type: 'default' },
              { label: 'Max 15 hops',             type: 'orange'  },
              { label: 'Slow convergence',         type: 'orange'  },
              { label: 'Simple config',            type: 'green'   },
            ]
          }
        },
        {
          id: 't2-s4',
          number: '04',
          title: 'Link-State Routing: OSPF',
          duration: '10 min',
          content: {
            highlight: {
              heading: 'Link-State Algorithm',
              body: 'Each router floods the entire network with its link-state advertisements (LSAs). Every router builds a complete map of the network, then runs Dijkstra\'s shortest-path algorithm locally.',
              accent: 'green'
            },
            compare: [
              { side: 'left',  heading: 'RIP (distance vector)', body: 'Shares routing tables with neighbours. Slow to converge. Hop count metric. Simple.' },
              { side: 'right', heading: 'OSPF (link-state)',      body: 'Shares topology info with all routers. Fast convergence. Cost metric (bandwidth). Complex.' },
            ],
            tags: [
              { label: 'Dijkstra\'s algorithm', type: 'default' },
              { label: 'Fast convergence',       type: 'green'   },
              { label: 'Bandwidth-aware',        type: 'green'   },
              { label: 'More memory/CPU',        type: 'orange'  },
            ]
          }
        },
        {
          id: 't2-s5',
          number: '05',
          title: 'Dynamic Routing Algorithms',
          duration: '3 min',
          content: {
            table: {
              headers: ['Algorithm type', 'Example', 'How it works', 'Best for'],
              rows: [
                ['Distance Vector', 'RIP, EIGRP', 'Share routing table with neighbours',    'Small networks'],
                ['Link State',      'OSPF, IS-IS', 'Flood topology, compute locally',        'Large enterprise'],
                ['Path Vector',     'BGP',         'Share full path + policy rules',         'Internet (BGP)'],
              ]
            },
            note: 'BGP (Border Gateway Protocol) is what routers on the open internet use — it\'s path vector, not distance vector or link-state. This makes it highly policy-driven.',
          }
        },
        {
          id: 't2-s6',
          number: '06',
          title: 'Autonomous Systems & Internet Architecture',
          duration: '7 min',
          content: {
            cards: [
              { label: 'AS (Autonomous System)', body: 'A network under a single admin domain — e.g. Telstra, Google. Identified by AS number (ASN).', accent: 'blue'   },
              { label: 'IGP (Interior)',          body: 'Routing within an AS — OSPF, RIP, EIGRP. Optimises for performance.',                           accent: 'green'  },
              { label: 'EGP (Exterior)',          body: 'Routing between ASes — BGP. Optimises for policy, not just speed.',                            accent: 'orange' },
            ],
            flow: {
              label: 'Inter-AS routing via BGP',
              steps: [
                { label: 'AS 7474',  sub: 'Telstra', type: 'default' },
                { label: '── BGP ──' },
                { label: 'AS 15169', sub: 'Google',  type: 'green'   },
                { label: '── BGP ──' },
                { label: 'AS 32934', sub: 'Meta',    type: 'orange'  },
              ]
            },
            note: 'The internet = thousands of ASes connected via BGP. Inside each AS, IGP (like OSPF) handles routing. BGP handles the inter-AS routing policy at a global scale.',
          }
        },
      ]
    }
  ],

  // ─── TCP/IP LAYERS ─────────────────────────────────────────────────────────
  // 5-layer model, ascending order (1 = bottom, 5 = top)
  tcpipLayers: [
    {
      number: 1,
      name: 'Physical',
      protocols: 'Ethernet · Wi-Fi · Fibre',
      detail: {
        role: 'Transmits raw bits over a physical medium',
        examples: ['Voltage levels, radio frequencies', 'Network cables, NICs, Wi-Fi radios', 'Covered in Modules 1 & 2'],
        moduleRelevance: false
      }
    },
    {
      number: 2,
      name: 'Data Link',
      protocols: 'Ethernet · MAC · ARP',
      detail: {
        role: 'Node-to-node delivery on the same network segment',
        examples: ['MAC addresses identify devices on a LAN', 'Ethernet and Wi-Fi (802.11) frames', 'Error detection via CRC', 'ARP resolves IP → MAC'],
        moduleRelevance: false
      }
    },
    {
      number: 3,
      name: 'Network',
      protocols: 'IP · ICMP · RIP · OSPF · BGP',
      detail: {
        role: 'Logical addressing and routing across networks — THIS MODULE ★',
        examples: ['IP addresses (IPv4/IPv6) identify devices globally', 'Routing protocols find the best path (RIP, OSPF, BGP)', 'Packet forwarding between routers hop-by-hop', 'Subnetting and CIDR divide address space'],
        moduleRelevance: true
      }
    },
    {
      number: 4,
      name: 'Transport',
      protocols: 'TCP · UDP',
      detail: {
        role: 'End-to-end delivery between applications — THIS MODULE ★',
        examples: ['Port numbers identify which application on a device', 'TCP: reliable, ordered, connection-oriented', 'UDP: fast, connectionless, no guarantees', 'TCP three-way handshake, flow control, congestion control'],
        moduleRelevance: true
      }
    },
    {
      number: 5,
      name: 'Application',
      protocols: 'HTTP · DNS · SMTP · FTP · SSH',
      detail: {
        role: 'User-facing protocols — covered in Module 4',
        examples: ['HTTP/HTTPS for web browsing', 'DNS translates domain names to IPs', 'SMTP for email, SSH for secure shell'],
        moduleRelevance: false
      }
    },
  ],

  // ─── ASSESSMENTS ───────────────────────────────────────────────────────────
  assessments: [
    {
      id: 'a1b',
      title: 'Assessment 1B: Modules 3–4 Labs',
      weight: '7.5%',
      due: 'Sunday Week 4',
      description: 'Lab report covering LAN, WLAN, network layers and transport layers.',
      linkedTopics: ['t1-s1', 't1-s2', 't1-s4', 't1-s5', 't1-s6', 't2-s1', 't2-s2'],
      labs: [
        { title: 'Lab 1', desc: 'Local area networks and wireless LAN' },
        { title: 'Lab 2', desc: 'Network layers and transport layers' },
      ],
      tips: [
        'Understand the difference between MAC and IP addressing before Lab 2',
        'Know the TCP three-way handshake — likely to appear in lab questions',
        'Be able to explain why subnetting is used',
      ]
    },
    {
      id: 'a2',
      title: 'Assessment 2: Network Traffic Analysis',
      weight: 'TBA',
      due: 'Weekend of Week 5',
      description: 'Covers concepts from Weeks 1–5. Includes a practice sample assessment.',
      linkedTopics: ['t1-s1', 't1-s2', 't1-s3', 't1-s4', 't1-s5', 't1-s6', 't2-s1', 't2-s2', 't2-s3', 't2-s4', 't2-s5', 't2-s6'],
      tips: [
        'This covers all of Weeks 1–5 — treat each module as a building block',
        'Focus on being able to trace a packet from source to destination across all layers',
        'Understand when to use TCP vs UDP and why',
      ]
    }
  ],

  // ─── QUIZ ──────────────────────────────────────────────────────────────────
  quiz: [
    {
      id: 'q1',
      question: 'What is the main difference between TCP and UDP?',
      options: [
        'TCP uses IP addresses; UDP uses MAC addresses',
        'TCP is connection-oriented and reliable; UDP is connectionless with no delivery guarantee',
        'TCP is faster; UDP is slower',
        'TCP works at Layer 2; UDP works at Layer 3',
      ],
      answer: 1,
      explanation: 'TCP establishes a session via handshake and guarantees delivery with ACKs. UDP skips all that for speed. Both operate at Layer 4 (Transport).',
      linkedTopics: ['t1-s5', 't1-s6'],
    },
    {
      id: 'q2',
      question: 'What does ARP do?',
      options: [
        'Translates domain names to IP addresses',
        'Encrypts traffic between two hosts',
        'Maps an IP address to a MAC address on the local network',
        'Assigns IP addresses automatically to devices',
      ],
      answer: 2,
      explanation: 'ARP (Address Resolution Protocol) broadcasts on the local network to find the MAC address corresponding to a known IP. DNS translates names → IPs. DHCP assigns IPs automatically.',
      linkedTopics: ['t1-s4'],
    },
    {
      id: 'q3',
      question: 'Why was IPv6 introduced?',
      options: [
        'IPv4 was too slow for modern networks',
        'IPv4 was running out of available addresses',
        'IPv6 uses less bandwidth than IPv4',
        'IPv4 couldn\'t support subnetting',
      ],
      answer: 1,
      explanation: 'IPv4 has ~4.3 billion addresses — with smartphones, IoT and global growth, those ran out. IPv6\'s 128-bit space is effectively inexhaustible. IPv4 supports subnetting fine.',
      linkedTopics: ['t1-s3'],
    },
    {
      id: 'q4',
      question: 'What is the key difference between RIP and OSPF?',
      options: [
        'RIP uses link-state; OSPF uses distance vector',
        'RIP is used between autonomous systems; OSPF is used within them',
        'RIP shares hop-count tables with neighbours; OSPF floods topology to all routers and uses Dijkstra\'s algorithm',
        'RIP supports IPv6; OSPF does not',
      ],
      answer: 2,
      explanation: 'RIP is distance vector — shares hop-count tables with direct neighbours, slow to converge. OSPF is link-state — every router floods its info everywhere and computes shortest paths with Dijkstra.',
      linkedTopics: ['t2-s3', 't2-s4'],
    },
    {
      id: 'q5',
      question: 'In the TCP three-way handshake, what is the correct sequence?',
      options: [
        'ACK → SYN → SYN-ACK',
        'SYN → SYN-ACK → ACK',
        'SYN → ACK → SYN-ACK',
        'SYN-ACK → SYN → ACK',
      ],
      answer: 1,
      explanation: 'Client sends SYN to initiate. Server replies SYN-ACK to confirm it received and is ready. Client sends ACK to complete. Connection is now established.',
      linkedTopics: ['t1-s5'],
    },
    {
      id: 'q6',
      question: 'Which protocol routes traffic between autonomous systems on the internet?',
      options: ['OSPF', 'RIP', 'BGP', 'ARP'],
      answer: 2,
      explanation: 'BGP (Border Gateway Protocol) is the EGP used between autonomous systems — it\'s what glues the internet together globally. OSPF and RIP are IGPs used inside a single AS.',
      linkedTopics: ['t2-s5', 't2-s6'],
    },
    {
      id: 'q7',
      question: 'A packet travels from your laptop to a web server. At which layer does each router along the path make forwarding decisions?',
      options: [
        'Layer 2 — Data Link, using MAC addresses',
        'Layer 3 — Network, using IP addresses',
        'Layer 4 — Transport, using port numbers',
        'Layer 5 — Application, using domain names',
      ],
      answer: 1,
      explanation: 'Routers operate at Layer 3 and forward packets based on destination IP address. Layer 2 (MAC) is only relevant within a single network segment. Ports are used by the endpoints, not intermediate routers.',
      linkedTopics: ['t2-s2'],
    },
    {
      id: 'q8',
      question: 'Which of the following best describes what a subnet mask does?',
      options: [
        'It encrypts the network portion of an IP address',
        'It defines which part of an IP address is the network and which is the host',
        'It limits the maximum number of routers in a network',
        'It maps IP addresses to MAC addresses',
      ],
      answer: 1,
      explanation: 'A subnet mask (e.g. /24 = 255.255.255.0) tells the device which bits in an IP address identify the network and which identify the specific host. This is fundamental to routing decisions.',
      linkedTopics: ['t1-s2'],
    },
  ],
};
