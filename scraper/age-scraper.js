const fs = require('fs');
const Crawler = require('crawler');

const members = require('../src/data/members.json');
const baseUrl = 'http://www.europarl.europa.eu/meps/en/';
const urls = members.map(m => {
  return {
    uri: baseUrl + m.id_mep,
    member: m
  };
});

const results = [];

const crawler = new Crawler({
  maxConnections: 10,
  callback(error, res, done) {
    if (error) {
      console.error(error);
    } else {
      const $ = res.$;
      const dateString = $('#birthDate').text();
      res.options.member.birthday = dateString.split('-').reverse().join('-');
      results.push(res.options.member);
    }
    done();
  }
});

crawler.queue(urls);

crawler.on('drain', () => {
  fs.writeFileSync('../src/data/members-age.json', JSON.stringify(results, null, 2));
});
