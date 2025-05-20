---
challenge: "Sample Challenge"
ctf_event: "PicoCTF 2025"
category: "OSINT"
author: "Mary Jane"
date: "2025-01-18"
---

## Challenge Description
This challenge involved manipulating browser cookies to bypass authentication.

![image](https://github.com/user-attachments/assets/a0c0b43c-25f9-4d69-be59-d50c7b89ca24)

## Solution
First, I examined the cookies using browser developer tools...


```

<!DOCTYPE html>
<html lang="en" data-theme="dark">

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charset="utf-8" />
    <title>Lil L3ak - Scores</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="a.css">
    <link rel="stylesheet" href="table_styles.css">
    <script src="script.js" defer></script>
    <script src="table_script.js" defer></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poltawski+Nowy:wght@500&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" />
</head>

<body>
    <div class="desktop">
        <img class="group-icon" alt="" src="dots.png">
        <div class="top-left-ellipse">
        </div>
        <div class="rectangle-div">
        </div>
        <img class="icon" alt="" src="Logo.png">

        <div class="right-ellipse">
        </div>
        <div class="frame-parent">
            <div class="home-parent">
                <a href="home.html" class="home">Home</a>
                <a href="team.html" class="home">Team</a>
                <a href="writeup.html" class="home">Writeups</a>
                <a href="scores.html" class="home" style="color: var(--primary);">Scores</a>
            </div>
            <div class="rectangle-parent">
                <div class="group-child"></div>
                <a href="contact.html" class="contact-us">Contact Us</a>
            </div>
        </div>
        <div class="lil-l3ak">LIL L3AK</div>
        <!-- Scores Section -->
        <section id="scores" class="content-section">
            <div class="container">
                <h2 class="section-title">Competition Scores</h2>
                <p class="section-description">Our performance in recent CTF competitions.</p>

                <!-- Update your HTML for the search bar -->
                <div class="scores-controls">
                    <div class="search-container">
                        <input type="text" class="search-input" placeholder="Search competitions...">
                        <button type="submit" class="search-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
                    </div>
                </div>
                <!-- Scores Table -->
                <div class="scores-table-wrapper">
                    <table class="scores-table">
                        <thead>
                            <tr>
                                <th>COMPETITION <span class="sort-arrow" data-sort="competition"></span></th>
                                <th>SCORES <span class="sort-arrow" data-sort="score"></span></th>
                                <th>RANK <span class="sort-arrow" data-sort="rank"></span></th>
                                <th>RATING POINTS <span class="sort-arrow" data-sort="rating"></span></th>
                                <th>DATE <span class="sort-arrow" data-sort="date"></span></th>
                            </tr>
                        </thead>
                        <tbody id="scores-body">
                            <!-- Rows will be dynamically inserted -->
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    </div>
</body>

</html>
```

