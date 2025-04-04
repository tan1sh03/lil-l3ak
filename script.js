
// GitHub integration for writeups
const githubConfig = {
  owner: 'tan1sh03',
  repo: 'lil-l3ak',
  branch: 'main',
  writeupPath: 'writeups'
};

// Join Form Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Define CTF categories
  const categories = [
      'Crypto', 'Rev', 'Pwn', 'Web', 'Misc', 
      'OSINT', 'Forensics', 'Blockchain', 'RF/Hardware'
  ];
  
  // Populate categories table
  const categoriesTable = document.getElementById('categoriesTable');
  if (categoriesTable) {
      // Create table header
      let headerRow = document.createElement('tr');
      headerRow.innerHTML = `
          <th></th>
          <th>Beginner</th>
          <th>Intermediate</th>
          <th>Advanced</th>
      `;
      categoriesTable.appendChild(headerRow);
      
      // Create rows for each category
      categories.forEach(category => {
          let row = document.createElement('tr');
          row.innerHTML = `
              <td>${category}</td>
              <td><input type="radio" name="${category}" value="Beginner"></td>
              <td><input type="radio" name="${category}" value="Intermediate"></td>
              <td><input type="radio" name="${category}" value="Advanced"></td>
          `;
          categoriesTable.appendChild(row);
      });
  }
  
  // Populate main category checkboxes
  const mainCategoryCheckboxes = document.getElementById('mainCategoryCheckboxes');
  if (mainCategoryCheckboxes) {
      categories.forEach(category => {
          let checkbox = document.createElement('div');
          checkbox.className = 'checkbox-container';
          checkbox.innerHTML = `
              <input type="checkbox" id="main-${category}" name="mainCategory" value="${category}">
              <label for="main-${category}">${category}</label>
          `;
          mainCategoryCheckboxes.appendChild(checkbox);
      });
      
      // Limit main category selection to 2
      const mainCategoryInputs = document.querySelectorAll('input[name="mainCategory"]');
      mainCategoryInputs.forEach(input => {
          input.addEventListener('change', function() {
              let checkedCount = document.querySelectorAll('input[name="mainCategory"]:checked').length;
              if (checkedCount > 2) {
                  this.checked = false;
                  alert('You can select a maximum of 2 main categories.');
              }
          });
      });
  }
  
  // Form submission
  const joinForm = document.getElementById('joinForm');
  if (joinForm) {
      joinForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Validate age
          const age = document.getElementById('age').value;
          if (!age || age < 13) {
              alert('Please enter a valid age (13 or older).');
              return;
          }
          
          // Validate country
          const country = document.getElementById('country').value;
          if (!country) {
              alert('Please enter your country.');
              return;
          }
          
          // Validate category selection
          let categoriesSelected = false;
          categories.forEach(category => {
              if (document.querySelector(`input[name="${category}"]:checked`)) {
                  categoriesSelected = true;
              }
          });
          
          if (!categoriesSelected) {
              alert('Please select your skill level for at least one category.');
              return;
          }
          
          // Validate main category selection
          const mainCategoriesSelected = document.querySelectorAll('input[name="mainCategory"]:checked').length;
          if (mainCategoriesSelected === 0) {
              alert('Please select at least one main category.');
              return;
          }
          
          // Validate CTF count
          const ctfCount = document.getElementById('ctfCount').value;
          if (!ctfCount || ctfCount < 0) {
              alert('Please enter a valid number of CTFs played.');
              return;
          }
          
          // Validate commitment
          const commitment = document.getElementById('commitment').value;
          if (!commitment) {
              alert('Please describe your commitment to playing CTFs.');
              return;
          }
          
          // Validate writeups
const writeups = document.getElementById('writeups').value.trim();
if (!writeups || writeups.length === 0) {
    alert('Please provide examples of your writeups or code.');
    return;
}
          
          // Validate social links
          const socialLinks = document.getElementById('socialLinks').value;
          if (!socialLinks) {
              alert('Please provide at least one social link or platform.');
              return;
          }
          
          // Validate Discord handle
          const discordHandle = document.getElementById('discordHandle').value;
          if (!discordHandle) {
              alert('Please provide your Discord handle for contact.');
              return;
          }
          
          // All validations passed
          alert('Thank you for your application! We will review it and contact you soon via Discord.');
          joinForm.reset();
      });
  }
});


// Check for hash in URL and activate corresponding section
document.addEventListener('DOMContentLoaded', function () {
  if (window.location.hash) {
    const sectionId = window.location.hash.substring(1); // Remove the # character
    const section = document.getElementById(sectionId);
    if (section && section.classList.contains('content-section')) {
      // Hide all sections
      document.querySelectorAll('.content-section').forEach(s => {
        s.classList.remove('active');
      });
      // Show the target section
      section.classList.add('active');
    }
  }
});

function extractFrontmatter(content) {
  console.log('Raw Markdown Content:', content); // Debugging log

  const frontmatterRegex = /^---\s*([\s\S]*?)\s*---/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    console.error('No valid frontmatter found in content.');
    return {};
  }

  const frontmatterText = match[1];
  console.log('Extracted Frontmatter Text:', frontmatterText); // Debugging log

  const frontmatter = {};

  // Parse each line of the frontmatter
  frontmatterText.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      const value = valueParts.join(':').trim();
      // Remove quotes if present
      frontmatter[key.trim()] = value.replace(/^"(.*)"$/, '$1');
    }
  });

  console.log('Parsed Frontmatter Object:', frontmatter); // Debugging log
  return frontmatter;
}

// Fetch writeups from GitHub
async function fetchWriteupsFromGitHub() {
  try {
    console.log('Fetching writeups from GitHub...');
    // Fetch directory listing
    const apiUrl = `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${githubConfig.writeupPath}?ref=${githubConfig.branch}`;
    console.log('API URL:', apiUrl);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error('API response not OK:', response.status, response.statusText);
      throw new Error('Failed to fetch writeups directory');
    }

    const files = await response.json();
    console.log('Files found:', files.length);

    const markdownFiles = files.filter(file => file.name.endsWith('.md'));
    console.log('Markdown files found:', markdownFiles.length);

    // Process each markdown file
    const writeups = await Promise.all(
      markdownFiles.map(async file => {
        console.log('Processing file:', file.name);
        const contentResponse = await fetch(file.download_url);
        if (!contentResponse.ok) throw new Error(`Failed to fetch ${file.name}`);

        const content = await contentResponse.text();
        // Extract frontmatter (simplified version)
        const frontmatter = extractFrontmatter(content);
        console.log('Extracted frontmatter for', file.name, frontmatter);

        return {
          ...frontmatter,
          filename: file.name,
          path: file.path,
          download_url: file.download_url
        };
      })
    );

    console.log('Processed writeups:', writeups.length);
    return writeups;
  } catch (error) {
    console.error('Error fetching writeups:', error);
    return [];
  }
}

/* ========================
   Table Management System
   ======================== */
const tableSystem = {
  // Configuration for all tables
  tables: {
    scores: {
      selector: '.scores-table',
      defaultSort: 4, // Date column
      dateColumn: 4,
      numericColumns: [1, 3], // Score and Rating columns
      rankColumn: 2  // Add this to identify the rank column
    },
    writeups: {
      selector: '.writeups-table',
      defaultSort: 4, // Date column
      dateColumn: 4,
      categoryColumn: 2  // Add this to identify the category column
    }
  },

  // Initialize all tables
  async init() {
    for (const tableId in this.tables) {
      const config = this.tables[tableId];
      await this.setupTable(config);
      this.initSorting(config);
      this.initSearch(config);
    }
  },

  // Generic table setup
  async setupTable(config) {
    const table = document.querySelector(config.selector);

    // Add sort arrows structure
    table.querySelectorAll('th').forEach((th, index) => {
      const sortArrow = document.createElement('span');
      sortArrow.className = 'sort-arrow';
      // Add actual content for the arrow
      sortArrow.innerHTML = '';
      th.appendChild(sortArrow);
      th.dataset.column = index;
    });

    // Initial population based on table type
    if (config.selector === '.writeups-table') {
      await this.populateWriteups();
    } else if (config.selector === '.scores-table') {
      this.populateScores();
    }
  },

  // Generic sorting handler
  initSorting(config) {
    const table = document.querySelector(config.selector);

    table.querySelectorAll('th').forEach(header => {
      header.addEventListener('click', () => {
        const columnIndex = parseInt(header.dataset.column);
        const isActive = header.classList.contains('sorted');
        const newDirection = isActive ?
          (header.classList.contains('desc') ? 'asc' : 'desc') : 'desc';

        this.sortTable(config, columnIndex, newDirection);
      });
    });

    // Initial sort
    this.sortTable(config, config.defaultSort, 'desc');
  },

  // Generic sorting function
  sortTable(config, columnIndex, direction) {
    const table = document.querySelector(config.selector);
    const tbody = table.querySelector('tbody');
    const headers = table.querySelectorAll('th');

    // Clear previous sorting states
    headers.forEach(header => {
      header.classList.remove('sorted', 'asc', 'desc');
    });

    // Apply sorting classes to the current header
    const currentHeader = table.querySelector(`th[data-column="${columnIndex}"]`);
    currentHeader.classList.add('sorted', direction);

    const rows = Array.from(tbody.rows);

    const isNumericColumn = config.numericColumns && config.numericColumns.includes(columnIndex);
    const isDateColumn = columnIndex === config.dateColumn;
    const isRankColumn = columnIndex === config.rankColumn;
    const isCategoryColumn = config.categoryColumn && columnIndex === config.categoryColumn;

    rows.sort((a, b) => {
      let aValue = a.cells[columnIndex].textContent.trim();
      let bValue = b.cells[columnIndex].textContent.trim();

      if (isRankColumn) {
        // Extract just the number before the slash for ranks like "299/4000"
        aValue = parseInt(aValue.split('/')[0]) || Infinity;
        bValue = parseInt(bValue.split('/')[0]) || Infinity;
        return direction === 'desc' ? bValue - aValue : aValue - bValue;
      }
      else if (isNumericColumn) {
        aValue = parseFloat(aValue.replace(/[^0-9.-]/g, '')) || -Infinity;
        bValue = parseFloat(bValue.replace(/[^0-9.-]/g, '')) || -Infinity;
        return direction === 'desc' ? bValue - aValue : aValue - bValue;
      }
      else if (isDateColumn) {
        // Parse dates in format DD-MM-YYYY or YYYY-MM-DD
        let aDate, bDate;

        // For DD-MM-YYYY format (like "01-04-2025")
        if (aValue.match(/^\d{2}-\d{2}-\d{4}$/)) {
          const [aDay, aMonth, aYear] = aValue.split('-');
          aDate = new Date(`${aYear}-${aMonth}-${aDay}`);
        }
        // For DD/MM/YYYY format
        else if (aValue.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
          const [aDay, aMonth, aYear] = aValue.split('/');
          aDate = new Date(`${aYear}-${aMonth}-${aDay}`);
        }
        // For YYYY-MM-DD format
        else {
          aDate = new Date(aValue);
        }

        // Same for bValue
        if (bValue.match(/^\d{2}-\d{2}-\d{4}$/)) {
          const [bDay, bMonth, bYear] = bValue.split('-');
          bDate = new Date(`${bYear}-${bMonth}-${bDay}`);
        }
        else if (bValue.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
          const [bDay, bMonth, bYear] = bValue.split('/');
          bDate = new Date(`${bYear}-${bMonth}-${bDay}`);
        }
        else {
          bDate = new Date(bValue);
        }

        // Handle invalid dates
        if (isNaN(aDate.getTime())) aDate = new Date(0);
        if (isNaN(bDate.getTime())) bDate = new Date(0);

        return direction === 'desc' ? bDate - aDate : aDate - bDate;
      }

      return direction === 'desc'
        ? bValue.localeCompare(aValue)
        : aValue.localeCompare(bValue);
    });

    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
  },

  // Updated initSearch function with specific handling for writeups
  initSearch(config) {
    // Determine which table we're working with
    const tableType = config.selector.includes('scores') ? 'scores' : 'writeups';

    // Try multiple potential selector patterns to find the search input
    let searchInput = document.querySelector(`.${tableType}-controls .search-input`);

    // If not found with the first pattern, try alternative selectors
    if (!searchInput) {
      searchInput = document.querySelector(`.${tableType}-section .search-input`);
    }

    if (!searchInput) {
      console.error(`Search input not found for ${tableType} table. Make sure the search input exists in the DOM.`);
      return;
    }

    console.log(`Setting up search for ${tableType} table with input:`, searchInput);

    // Add event listener for the search input
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      console.log(`Searching for: "${term}" in ${tableType} table`);

      const rows = document.querySelectorAll(`${config.selector} tbody tr`);
      console.log(`Found ${rows.length} rows to search through`);

      rows.forEach(row => {
        const text = Array.from(row.cells)
          .map(cell => cell.textContent.toLowerCase())
          .join(' ');
        const matches = text.includes(term);
        row.style.display = matches ? '' : 'none';
      });
    });

    // Also handle the search button click if it exists
    const searchButton = searchInput.nextElementSibling;
    if (searchButton && searchButton.classList.contains('search-button')) {
      searchButton.addEventListener('click', () => {
        // Trigger the same search logic when the button is clicked
        const event = new Event('input', { bubbles: true });
        searchInput.dispatchEvent(event);
      });
    }
  },

  scoresData: [
    {
      competition: "JerseyCTF V",
      score: 24376.0000,
      rank: "10/406",
      rating: 17.414,
      date: "01-04-2025"
    },
    {
      competition: "SwampCTF 2025",
      score: 2039.0000,
      rank: "83/750",
      rating: 16.044,
      date: "31-03-2025"
    },
    {
      competition: "Cyber Apocalypse CTF 2025: Tales from Eldoria",
      score: 33750.0000,
      rank: "299/4000+",
      rating: 14.285,
      date: "26-03-2025"
    },
    {
      competition: "Pearl CTF",
      score: 100.0000,
      rank: "412/456",
      rating: 0.458,
      date: "08-03-2025"
    },
    {
      competition: "Hackfinity Battle (THM)",
      score: 690,
      rank: "234/4300+",
      rating: "---",
      date: "20-03-2025"
    }
  ],

  populateScores() {
    const tbody = document.querySelector('.scores-table tbody');

    tbody.innerHTML = this.scoresData.map(score => `
    <tr>
      <td>${score.competition}</td>
      <td>${score.score}</td>
      <td>${score.rank}</td>
      <td>${score.rating}</td>
      <td>${score.date}</td>
    </tr>`).join('');
  },

  // Update the populateWriteups function to reinitialize search after loading data
  async populateWriteups() {
    // Fetch writeups from GitHub
    const writeups = await fetchWriteupsFromGitHub();
    if (writeups.length === 0) {
      console.warn('No writeups found or error fetching from GitHub.');
      return;
    }

    this.writeupsData = writeups;

    const tbody = document.querySelector('.writeups-table tbody');

    tbody.innerHTML = writeups.map(writeup => `
    <tr>
      <td>
        <a href="/writeups.html?file=${encodeURIComponent(writeup.filename)}" class="challenge-link">
          ${writeup.challenge}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="link-icon" viewBox="0 0 24 24">
            <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"></path>
            <path d="M11 13l9 -9"></path>
            <path d="M15 4h5v5"></path>
          </svg>
        </a>
      </td>
      <td>${writeup.ctf_event}</td>
      <td>${writeup.category}</td>
      <td>${writeup.author}</td>
      <td>${writeup.date}</td>
    </tr>
  `).join('');

    document.addEventListener("DOMContentLoaded", () => {
      // Select all elements with the class 'link-icon'
      const linkIcons = document.querySelectorAll(".link-icon");

      // Iterate through each icon and set its color to white
      linkIcons.forEach((icon) => {
        icon.style.fill = "#FFFFFF"; // For SVG icons
        icon.style.color = "#FFFFFF"; // For other types of icons
      });

      console.log("Link icon colors updated to white.");
    });

    // Reinitialize search for the writeups table after populating data
    this.initSearch(this.tables.writeups);
  }
};

// Navigation functionality
document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('nav a');
  const contentSections = document.querySelectorAll('.content-section');

  // Function to activate a specific section
  function activateSection(sectionId) {
    // Remove active class from all links and sections
    navLinks.forEach(navLink => navLink.classList.remove('active'));
    contentSections.forEach(section => section.classList.remove('active'));

    // Activate the target section
    const targetSection = document.getElementById(sectionId);
    const targetLink = document.querySelector(`nav a[data-section="${sectionId}"]`);

    if (targetSection) targetSection.classList.add('active');
    if (targetLink) targetLink.classList.add('active');

    // Update URL hash without scrolling
    history.replaceState(null, null, `#${sectionId}`);
  }

  // Check URL hash first (highest priority)
  if (window.location.hash) {
    const hashSectionId = window.location.hash.substring(1);
    if (document.getElementById(hashSectionId)) {
      activateSection(hashSectionId);
    }
  }
  // Then check stored section from sessionStorage
  else {
    const storedActiveSection = sessionStorage.getItem('activeSection');
    if (storedActiveSection && document.getElementById(storedActiveSection)) {
      activateSection(storedActiveSection);
      // Clear the stored section now that we've used it
      sessionStorage.removeItem('activeSection');
    }
  }

  // Add click event listeners to navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      // Get the section to show
      const sectionId = this.getAttribute('data-section');
      activateSection(sectionId);
    });
  });
});

/* ========================
   Initialization
   ======================== */
document.addEventListener('DOMContentLoaded', async () => {
  await tableSystem.init();
});

// Team Member Modal Functionality
document.addEventListener('DOMContentLoaded', function () {
  // Create team members with placeholder data
  const teamSection = document.getElementById('team');
  const teamGrid = teamSection.querySelector('.team-grid');

  // Sample team members data
  const teamMembers = [
    {
    name: "VivisGhost",
      role: "Admin and Team Mentor",
      bio: "Ghost in the Box — Acclimated to the arcane. Brain broken by bad binaries. Cursed by stego. Hexes come encoded — half-off if they're haunted.",
      categories: ["Forensics", "Misc"],
      socials: ["https://github.com/dbissell6/DFIR/tree/main"],
      image: "VivisGhost.png",
    },
    {
      name: "sk4r3kr0w",
      role: "Team Captain",
      bio: "Im like an old program, prone to memory leaks and buffer overflows.",
      categories: ["OSINT", "Web"],
      socials: [],
      image: "sk4r3kr0w.jpeg",
    },
    {
      name: "S1nC0s134",
      role: "Web and Crypto Specialist",
      bio: "The Spider-Man of Web challenges, weaving through vulnerabilities with ease. Crypto is his passion, but binaries? His kryptonite.",
      categories: ["Cryptography", "Web"],
      socials: ["https://linkedin.com/in/tanish-sancheti"],
      image: "S1nC0s134.jpg",
    },
    {
      name: "maomaofan",
      role: "Forensics and OSINT Specialist",
      bio: "4n6 wannabee, uses HxD for memdump and disk challenges, big fan of 0x157",
      categories: ["Forensics", "OSINT"],
      socials: ["https://medium.com/@nathanielpascuarijndorp"],
      image: "maomaofan.jpg",
      },
      {
      name: "pphreak_1001",
      role: "Pattern Recognition Specialist",
      bio: "His keen eye sees patterns where others see chaos.",
      categories: ["OSINT", "Web"],
      socials: [],
      image: "pphreak_1001.jpeg",
      },
      {
      name: "NoobHackBot",
      role: "Web Security Enthusiast",
      bio: "Specializes in web, until an encryption pops up. By then he just prays that it's just base64...",
      categories: ["Web"],
      socials: [],
      image: "NoobHackBot.png",
      },
      {
      name: "DxS",
      role: "Binary Analysis Expert",
      bio: "Breaks binaries. Rebuilds them just to break them better.",
      categories: ["Pwn", "Rev"],
      socials: ["https://www.linkedin.com/in/dellaili/"],
      image: "DxS.png",
      },
      {
      name: "GoblinPanda80",
      role: "Crypto and Forensics Expert",
      bio: "Forensic guru by day, crypto ninja by night.",
      categories: ["Cryptography", "Forensics"],
      socials: ["https://www.linkedin.com/in/filip-prodanovic-64728015a/"],
      image: "GoblinPanda80.jpg",
      },
      {
      name: "PEGAS0",
      role: "Red Team and Forensics Analyst",
      bio: "Red teamer by passion, forensic analyst by necessity—forever decrypting cursed stego and hunting flags in every CTF.",
      categories: ["Forensics", "Misc"],
      socials: [],
      image: "PEGAS0.jpg",
      },
      {
      name: "p._.k",
      role: "Web and OSINT Specialist",
      bio: "Professional curl user.",
      categories: ["OSINT", "Web"],
      socials: ["https://github.com/pradhamk"],
      image: "pk.png",
      },
      {
      name: "g2f1",
      role: "Cryptography and Forensics Expert",
      bio: "A seeker of secrets, best known for cracking the Z13",
      categories: ["Cryptography", "Forensics"],
      socials: ["https://g2f1.github.io/"],
      image: "g2f1.jpg",
      },
      {
      name: "vreshco",
      role: "Forensics and Pwn Specialist",
      bio: "Every byte has a story; every timestamp is a witness.",
      categories: ["Forensics", "Pwn"],
      socials: ["https://www.linkedin.com/in/nicsap/"],
      image: "vreshco.jpg",
      },
      {
      name: "mokab",
      role: "Cryptography and Web Security Specialist",
      bio: "It's not a bug, it's a way to get access",
      categories: ["Cryptography", "Web"],
      socials: ["https://github.com/kabirimouad"],
      image: "mokab.jpg",
      },
  ];

  // Clear existing content and create team member cards
  teamMembers.forEach((member, index) => {
    const memberCard = document.createElement('div');
    memberCard.className = 'team-member';
    memberCard.dataset.memberId = index;

    memberCard.innerHTML = `
          <div class="avatar">
            <img src="assets/${member.image}" alt="${member.name}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\'><circle cx=\\'50\\' cy=\\'50\\' r=\\'45\\' fill=\\'%236366F1\\'/><text x=\\'50%\\' y=\\'50%\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' font-family=\\'Arial\\' font-size=\\'40\\' fill=\\'white\\'>${member.name.charAt(0)}</text></svg>'">
          </div>
          <h3>${member.name}</h3>
          <p>${member.role}</p>
        `;

    teamGrid.appendChild(memberCard);

    // Add click event to open modal
    memberCard.addEventListener('click', function () {
      openTeamModal(member);
    });
  });

  // Create modal container if it doesn't exist
  if (!document.querySelector('.team-modal')) {
    const modalContainer = document.createElement('div');
    modalContainer.className = 'team-modal';
    document.body.appendChild(modalContainer);
  }

  // Function to open team member modal
  function openTeamModal(member) {
    const modal = document.querySelector('.team-modal');

    // Create categories HTML
    const categoriesHTML = member.categories.map(cat =>
      `<span class="category-tag">${cat}</span>`
    ).join('');

    // Create socials HTML
  const socialsHTML = member.socials.map(social => {
    let iconName;
    if (social.includes('github')) {
      iconName = 'github';
    } else if (social.includes('linkedin')) {
      iconName = 'linkedin-in';
    } else if (social.includes('twitter')) {
      iconName = 'twitter';
    } else if (social.includes('medium')) {
      iconName = 'medium-m'; // Adding Medium icon
    } else {
      iconName = 'link'; // Default fallback for other links
    }
    return `
      <a href="${social}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="${iconName}">
        <i class="fab fa-${iconName}"></i>
      </a>
    `;
  }).join('');

    modal.innerHTML = `
          <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-header">
              <div class="modal-avatar">
                <img src="assets/${member.image}" alt="${member.name}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\'><circle cx=\\'50\\' cy=\\'50\\' r=\\'45\\' fill=\\'%236366F1\\'/><text x=\\'50%\\' y=\\'50%\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' font-family=\\'Arial\\' font-size=\\'40\\' fill=\\'white\\'>${member.name.charAt(0)}</text></svg>'">
              </div>
              <div>
                <h2>${member.name}</h2>
                <p>${member.role}</p>
              </div>
            </div>
            <div class="modal-bio">
              <p>${member.bio}</p>
            </div>
            <div class="modal-categories">
              <h3>Expertise</h3>
              <div class="category-tags">
                ${categoriesHTML}
              </div>
            </div>
            <div class="modal-socials">
              <h3>Connect</h3>
              <div class="social-links">
                ${socialsHTML}
              </div>
            </div>
          </div>
        `;

    modal.style.display = 'block';

    // Add close functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', function () {
      modal.style.display = 'none';
    });

    // Close when clicking outside the modal content
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }

  // Add SVG definitions for social icons
  const svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgDefs.style.display = 'none';
  svgDefs.innerHTML = `
      <defs>
        <symbol id="icon-github" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
        </symbol>
        <symbol id="icon-twitter" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </symbol>
        <symbol id="icon-linkedin" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </symbol>
        <symbol id="icon-discord" viewBox="0 0 24 24">
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3847-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.      <symbol id="icon-discord" viewBox="0 0 24 24">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3847-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1277c-.5979.3428-1.2194.6447-1.8722.8923a.076.076 0 00-.0416.1057c.3574.698.7689 1.3628 1.225 1.9942a.076.076 0 00.0842.0276c1.961-.6066 3.9495-1.5218 6.0023-3.0294a.077.077 0 00.0313-.0561c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z"/>
      </symbol>
      <symbol id="icon-website" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1 16.057V12h4.995c-.059 1.143-.25 2.233-.564 3.236a6.763 6.763 0 01-3.296 1.064A9.337 9.337 0 0113 16.057zM12 10V3.993a9.347 9.347 0 011.135.233 6.764 6.764 0 013.296 1.064c.314 1.003.505 2.093.564 3.236H12zm6.992 1c.024.343.036.69.036 1.041s-.012.698-.036 1.041h-5.993v-2.082h5.993zM8.864 4.006A9.347 9.347 0 0110 3.993v6.014H5.005c.059-1.143.25-2.233.564-3.236a6.764 6.764 0 012.776-1.15c.174-.048.35-.087.519-.116zM5.005 12h4.995v4.057a9.337 9.337 0 01-1.136-.233 6.763 6.763 0 01-3.296-1.064A9.913 9.913 0 015.005 12zm2.776 7.994a6.764 6.764 0 01-2.776-1.15 9.913 9.913 0 01-.564-3.236h4.995v6.014a9.347 9.347 0 01-1.655-.628zm8.559-1.15a6.764 6.764 0 01-2.776 1.15 9.347 9.347 0 01-1.655.628v-6.014h4.995a9.913 9.913 0 01-.564 3.236z"/>
      </symbol>
    </defs>
  `;
  document.body.appendChild(svgDefs);
});

// Toggle between light and dark themes
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Theme toggle functionality
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Check if user has a preferred theme stored
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  }

  // Toggle between light and dark themes
  themeToggle.addEventListener('click', function () {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
});

// Burger menu and theme toggle integration
document.addEventListener('DOMContentLoaded', function () {
  const burgerMenu = document.querySelector('.burger-menu');
  const mainNav = document.getElementById('main-nav');
  const themeToggle = document.getElementById('theme-toggle');

  burgerMenu.addEventListener('click', function () {
    mainNav.classList.toggle('active');

    // When burger menu is active, move theme toggle inside
    if (mainNav.classList.contains('active') && window.innerWidth <= 576) {
      mainNav.appendChild(themeToggle);
      themeToggle.style.display = 'flex';
    } else if (window.innerWidth <= 576) {
      // When burger menu is closed, hide theme toggle on mobile
      document.querySelector('header').appendChild(themeToggle);
      themeToggle.style.display = 'none';
    }
  });

  // Handle resize events
  window.addEventListener('resize', function () {
    if (window.innerWidth > 576) {
      // On desktop, ensure theme toggle is in header
      if (themeToggle.parentElement !== document.querySelector('header')) {
        document.querySelector('header').appendChild(themeToggle);
      }
      themeToggle.style.display = 'flex';
    } else {
      // On mobile, check if burger menu is active
      if (!mainNav.classList.contains('active')) {
        themeToggle.style.display = 'none';
      }
    }
  });
});

// Navigation functionality
const navLinks = document.querySelectorAll('nav a');
const contentSections = document.querySelectorAll('.content-section');

navLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    // Remove active class from all links
    navLinks.forEach(navLink => navLink.classList.remove('active'));

    // Add active class to clicked link
    this.classList.add('active');

    // Get the section to show
    const sectionId = this.getAttribute('data-section');

    // Hide all sections
    contentSections.forEach(section => section.classList.remove('active'));

    // Show the selected section
    document.getElementById(sectionId).classList.add('active');
  });
});

// Sample SVG icons for social media and theme toggle
// Enhanced SVG icons with better viewBox settings and styling
const svgIcons = {
  discord: `<path fill="currentColor" d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.9-.608 1.3A15.15 15.15 0 0 0 9.14 4.32a.077.077 0 0 0-.082-.028 15.525 15.525 0 0 0-4.877 1.5.07.07 0 0 0-.032.027C1.983 9.38 1.327 14.11 1.677 18.775a.082.082 0 0 0 .031.056 15.624 15.624 0 0 0 4.697 2.375.077.077 0 0 0 .084-.026c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 10.33 10.33 0 0 1-1.477-.703.077.077 0 0 1-.008-.128c.1-.074.199-.152.293-.23a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.063 0a.074.074 0 0 1 .078.01c.095.078.193.156.293.23a.077.077 0 0 1-.006.127 9.55 9.55 0 0 1-1.479.704.077.077 0 0 0-.041.106c.36.698.772 1.363 1.225 1.993a.076.076 0 0 0 .084.028 15.576 15.576 0 0 0 4.702-2.377.077.077 0 0 0 .032-.054c.417-5.322-.699-9.98-2.956-14.271a.06.06 0 0 0-.031-.028zM8.475 15.596c-.927 0-1.695-.85-1.695-1.89 0-1.042.757-1.89 1.695-1.89.945 0 1.705.856 1.693 1.89 0 1.04-.757 1.89-1.693 1.89zm6.252 0c-.928 0-1.695-.85-1.695-1.89 0-1.042.757-1.89 1.695-1.89.944 0 1.704.856 1.692 1.89 0 1.04-.748 1.89-1.692 1.89z"/>`,

  instagram: `<path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>`,

  ctftime: `<path fill="currentColor" d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm0 2c-5.514 0-10 4.486-10 10s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm1 10V7c0-.552-.448-1-1-1s-1 .448-1 1v6c0 .38.214.725.553.895l3.447 1.724c.494.247 1.095.047 1.342-.447.246-.494.046-1.095-.448-1.342L13 12z"/>`,

  x: `<path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>`,

  // Enhanced sun icon with rays
  sun: `<circle cx="12" cy="12" r="5" fill="currentColor"/>
         <path fill="currentColor" d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/>`,

  // Enhanced moon icon
  moon: `<path fill="currentColor" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`
};

// Insert SVG icons
const iconSun = document.querySelector('.icon-sun');
const iconMoon = document.querySelector('.icon-moon');
const discordIcon = document.querySelector('footer .icon-discord');
const instagramIcon = document.querySelector('footer .icon-instagram');
const ctftimeIcon = document.querySelector('footer .icon-ctftime');
const xIcon = document.querySelector('footer .icon-x');

// Helper function to safely insert SVG content
function safelyInsertSVG(element, svgContent) {
  if (element) {
    element.innerHTML = svgContent;
  }
}

// Insert all SVG icons
safelyInsertSVG(iconSun, svgIcons.sun);
safelyInsertSVG(iconMoon, svgIcons.moon);
safelyInsertSVG(discordIcon, svgIcons.discord);
safelyInsertSVG(instagramIcon, svgIcons.instagram);
safelyInsertSVG(ctftimeIcon, svgIcons.ctftime);
safelyInsertSVG(xIcon, svgIcons.x);

// Create placeholder logo (replace with your actual logo later)

// Insert logo
const logoImg = document.querySelector('.logo img');
if (logoImg) {
  logoImg.replaceWith(logoSvg);
}

document.getElementById('joinForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Collect Form Data
  const formData = new FormData(this);
  
  const data = {};
  
   formData.forEach((value, key) => data[key] = value)
});
