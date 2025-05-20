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


```python
encoded = "152 162 152 145 162 167 150 172 153 162 145 170 141 162"
list_encoded = encoded.split(' ')
decimal_encoded = [int(i, 8) for i in list_encoded] #Decimal Conversion
string_encoded = [chr(i) for i in decimal_encoded] #ASCII Conversion
string_encoded  = ''.join(string_encoded)
print("String Encoded: " + string_encoded)
```
