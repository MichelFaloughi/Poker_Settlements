# Poker Settlements Calculator

A beautiful, modern web application for calculating poker game settlements. This tool helps you determine who owes what after a poker game by tracking each player's buy-in amount and final chip count.

## Features

- **Visual Poker Table**: See all players positioned around a realistic poker table
- **Player Management**: Add, remove, and manage players with their buy-in and end amounts
- **Smart Settlement**: Automatically calculates optimal transactions to minimize the number of payments needed
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Real-time Validation**: Ensures the total buy-ins match the total end amounts
- **Beautiful UI**: Modern, poker-themed interface with smooth animations

## How to Use

1. **Add Players**: Enter each player's name, buy-in amount, and final chip count
2. **Review Table**: See all players positioned around the virtual poker table
3. **Settle Up**: Click "Settle Up" to calculate the optimal payment transactions
4. **Follow Instructions**: The app will show you exactly who should pay whom and how much

## Example

Let's say you have a 4-player game:
- Alice: Buy-in $100, End $150 (won $50)
- Bob: Buy-in $100, End $80 (lost $20)
- Charlie: Buy-in $100, End $120 (won $20)
- Diana: Buy-in $100, End $50 (lost $50)

The app will calculate that:
- Bob pays Alice $20
- Diana pays Alice $30
- Total transactions: 2 (minimal number needed)

## Deployment to GitHub Pages

### Option 1: Automatic Deployment (Recommended)

1. **Push to GitHub**: Upload all files to a GitHub repository
2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click "Settings" tab
   - Scroll down to "Pages" section
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"
3. **Access Your Site**: Your app will be available at `https://yourusername.github.io/your-repo-name`

### Option 2: Manual Setup

1. **Create Repository**: Create a new repository on GitHub
2. **Upload Files**: Upload all the web files to the repository:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`
3. **Enable Pages**: Follow the same steps as Option 1

### File Structure for GitHub Pages

```
your-repo/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript logic
├── README.md           # This file
├── Player.py           # Original Python Player class
├── PokerTable.py       # Original Python PokerTable class
└── appendix.txt        # Original requirements
```

## Technical Details

### Frontend Technologies
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **JavaScript (ES6+)**: Client-side logic and DOM manipulation
- **Font Awesome**: Icons
- **Google Fonts**: Inter font family

### Key Features
- **Responsive Design**: Mobile-first approach with breakpoints for different screen sizes
- **Accessibility**: Proper ARIA labels, keyboard navigation, and semantic HTML
- **Performance**: Optimized animations and efficient DOM updates
- **Cross-browser Compatibility**: Works on all modern browsers

### Algorithm
The settlement algorithm:
1. Validates that total buy-ins equal total end amounts
2. Calculates each player's net position (end amount - buy-in)
3. Sorts players by their net position
4. Generates optimal transactions to minimize the number of payments
5. Ensures all debts are settled with the fewest possible transactions

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Note**: This web application is a frontend implementation of the original Python poker settlement logic. The core algorithm has been ported to JavaScript for browser compatibility while maintaining the same mathematical accuracy. 