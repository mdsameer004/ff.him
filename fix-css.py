import re

def clean_css(path):
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    cleaned = []
    skip_next = 0
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Detect lines that have valid CSS ending but then junk SVG data appended
        # e.g.: `    background-size: 400px 400px;"data:image...`
        # Strip everything after `;"data:image` or `}\"data:image`
        if '"data:image' in line:
            # Truncate the line at the junk
            clean_line = re.split(r'"data:image', line)[0]
            # If it ends with a semicolon or just whitespace, keep it
            clean_line = clean_line.rstrip()
            if clean_line:
                cleaned.append(clean_line + '\n')
            # Skip subsequent lines that are orphaned duplicates of background props
            # (these come right after the junk and before the next real selector)
            i += 1
            while i < len(lines):
                next_line = lines[i].strip()
                # These orphaned lines look like: background-repeat: ..., background-size: ..., overflow: ..., }
                if re.match(r'^(background-repeat|background-size|background-image|background-color|overflow|position|filter)\s*:', next_line):
                    i += 1  # skip orphaned property
                elif next_line == '}':
                    i += 1  # skip orphaned closing brace
                    break
                else:
                    break  # reached real content
            continue

        cleaned.append(line)
        i += 1

    # Second pass: remove duplicate orphaned props outside blocks
    # (lines like `    line-height: 1.6;` appearing after a `}` with no preceding selector)
    result = []
    j = 0
    while j < len(cleaned):
        line = cleaned[j]
        result.append(line)
        j += 1

    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(result)
    
    print(f"Cleaned: {path}")
    # Show lines around hero-section for verification
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    hero_match = re.search(r'.{0,50}\.hero-section.{0,500}', content, re.DOTALL)
    if hero_match:
        print("Hero section preview:", hero_match.group()[:300])

clean_css('css/style.css')
clean_css('css/floral-theme.css')
print("\nAll done!")
