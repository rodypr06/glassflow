import express from 'express';
import axios from 'axios';

const router = express.Router();

const quotes = [
  "A budget is telling your money where to go instead of wondering where it went.",
  "Beware of little expenses; a small leak will sink a great ship.",
  "Do not save what is left after spending, but spend what is left after saving.",
  "It's not your salary that makes you rich, it's your spending habits.",
  "Money is a terrible master but an excellent servant.",
  "The art is not in making money, but in keeping it.",
  "Rich people have small TVs and big libraries, and poor people have small libraries and big TVs.",
  "Financial peace isn't the acquisition of stuff. It's learning to live on less than you make.",
  "A penny saved is a penny earned.",
  "Don't work for money. Make it work for you.",
  "Invest in yourself. Your knowledge is the engine of your wealth.",
  "Compound interest is the eighth wonder of the world.",
  "Time is more valuable than money. You can get more money, but you cannot get more time.",
  "The stock market is filled with individuals who know the price of everything, but the value of nothing.",
  "In investing, what is comfortable is rarely profitable.",
  "The four most dangerous words in investing are: 'This time it's different.'",
  "The individual investor should act consistently as an investor and not as a speculator.",
  "Know what you own, and know why you own it.",
  "The stock market is a device for transferring money from the impatient to the patient.",
  "Price is what you pay. Value is what you get.",
  "It's not how much money you make, but how much money you keep, how hard it works for you, and how many generations you keep it for.",
  "I will tell you how to become rich. Close the doors. Be fearful when others are greedy and greedy when others are fearful.",
  "Someone's sitting in the shade today because someone planted a tree a long time ago.",
  "If you buy things you do not need, soon you will have to sell things you need.",
  "Too many people spend money they haven't earned, to buy things they don't want, to impress people they don't like.",
  "A fool and his money are soon parted.",
  "Money can't buy happiness, but it can make you awfully comfortable while you're being miserable.",
  "The safest way to double your money is to fold it over and put it in your pocket.",
  "It is better to have a permanent income than to be fascinating.",
  "Money often costs too much.",
  "Finance is not merely about making money. It's about achieving our deep goals and protecting the fruits of our labor."
];

// Get random quote
router.get('/random', (req, res) => {
  try {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    
    res.json({
      quote,
      index: randomIndex
    });
  } catch (error) {
    console.error('Get random quote error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get quote by index
router.get('/:index', (req, res) => {
  try {
    const index = parseInt(req.params.index);
    
    if (isNaN(index) || index < 0 || index >= quotes.length) {
      return res.status(400).json({ error: 'Invalid quote index' });
    }
    
    res.json({
      quote: quotes[index],
      index
    });
  } catch (error) {
    console.error('Get quote error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all quotes
router.get('/', (req, res) => {
  try {
    res.json({
      count: quotes.length,
      quotes: quotes.map((quote, index) => ({ quote, index }))
    });
  } catch (error) {
    console.error('Get quotes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
