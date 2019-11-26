# EU Parliament Votes

Visualizing voting results in the European Parliament. The results can be viewed sorted by seat, political group and age. Every dot represents a single vote – yes, no or abstention. A tooltip provides basic information about the MEP. For small screen devices, the visualizations are shown as simple, aggregated charts.

## Who voted for Article 13?

**Full article**: [Who voted for Article 13?](https://stekhn.github.io/eu-parliament-votes/)

On March 26th Members of the European Parliament voted to pass a new copyright directive. The bill became famous, mainly because of Article 13, which requires online platforms to remove copyrighted material from their websites. Fear of censorship brought thousands of people to the streets protesting to #SaveTheInternet. While the bill was intended to protect the creative rights of writers and artists, it will mostly benefit big publishers – restricting freedom and creativity for everyone else. 

![Voting results for EU copyright reform](src/images/preview.jpg?raw=true)

## Data

All datasets were obtained from the EU parliament's website on March 26, 2019. Some datasets required some wrangling, most of which was done on the command line.

- Voting results: [votes.json](https://github.com/stekhn/eu-parliament-votes/blob/master/src/data/votes.json) from the official voting results [Am 271, page 52](http://www.europarl.europa.eu/doceo/document/PV-8-2019-03-26-RCV_EN.pdf)
- Seating plan: [seats.json](https://github.com/stekhn/eu-parliament-votes/blob/master/src/data/seats.json) from the [interactive seating plan](https://www.europarl.europa.eu/hemicycle/)
- MEP profiles [members.json](https://github.com/stekhn/eu-parliament-votes/blob/master/src/data/members.json) from the [interactive seating plan](https://www.europarl.europa.eu/hemicycle/js/meps_str.js) and the [MEP database](http://www.europarl.europa.eu/meps/en/)

The MEP database was scraped using this simple Node.js script: [scraper/age-scraper.js](scraper/age-scraper.js)

## Development

For development, you'll need the JavaScript runtime [Node.js](https://nodejs.org/). The Node.js package manager [npm](https://www.npmjs.com/) comes bundled with the Node.js installer or package. The application is hot served and bundled with [Webpack](https://webpack.js.org/).

Install all the necessary dependencies for development:

```bash
npm install
```

Start a small development server on <http://localhost:9000>:

```bash
npm start
```

Bundle and optimize code and assets for production:

```bash
npm run build
```

## Related projects
- Julia Reda: [How your MEPs voted on internet freedoms](https://juliareda.eu/2019/04/copyright-final-vote/)
- Stefan Wehrmeyer: [Visualising EU Parliament Vote PDFs](https://observablehq.com/@stefanw/parsing-eu-parliament-vote-pdfs)
- Geoffrey Brossard: [d3-parliament](https://github.com/geoffreybr/d3-parliament)
- Track EU policy debates and votes: [VoteWatch.eu](https://www.votewatch.eu/)
- Lobby groups in the EU parliament: [LobbyFacts.eu](https://lobbyfacts.eu/)
- Send Freedom of Information request to the EU: [AsktheEU.org](https://www.asktheeu.org/de)
