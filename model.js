// ##################
// #  Model class   #
// ##################
// Users
// Products
// Orders

export var DB = {
  users: [
    {
      user_id: "0",
      credentials: "0",
      password: "123456",
      username: "shiqi",
      first_name: "Shiqi",
      last_name: "Shu",
    },
    {
      user_id: "1",
      credentials: "1",
      password: "123456",
      username: "arina",
      first_name: "Arina",
      last_name: "Shahbazi",
    },
    {
      user_id: "2",
      credentials: "0",
      password: "123456",
      username: "claudia",
      first_name: "Claudia",
      last_name: "VanValkenburg",
    },
    {
      user_id: "3",
      credentials: "0",
      password: "123456",
      username: "ahmad",
      first_name: "Ahmad",
      last_name: "Jabri",
    },
    {
      user_id: "4",
      credentials: "0",
      password: "123456",
      username: "manager",
    },
    {
      user_id: "5",
      credentials: "0",
      password: "123456",
      username: "waiter",
    },
    {
      user_id: "6",
      credentials: "0",
      password: "123456",
      username: "bartender",
    },
    {
      user_id: "7",
      credentials: "0",
      password: "123456",
      username: "jorass",
      first_name: "Jory",
      last_name: "Assies",
    },
    {
      user_id: "8",
      credentials: "3",
      password: "123456",
      username: "sulstr",
      first_name: "Sulayman",
      last_name: "Street",
    },
    {
      user_id: "9",
      credentials: "3",
      password: "123456",
      username: "orapan",
      first_name: "Orabela",
      last_name: "Panders",
    },
    {
      user_id: "10",
      credentials: "3",
      password: "123456",
      username: "kenolg",
      first_name: "Kenan",
      last_name: "Olguin",
    },
  ],
  products: [
    //Beer
    {
      nr: "1004703",
      articleid: "723841",
      articletype: "10047",
      name: "Nils Oscar",
      name2: "Celebration Ale",
      price: "43.70",
      volumeml: null,
      priceperlitre: null,
      introduced: "2013-02-01",
      finaldelivery: " ",
      catgegory: "\u00c3\u2013l, Ale",
      packaging: "Flaska",
      captype: "",
      countryoforigin: "",
      countryoforiginlandname: "Sverige",
      producer: "Nils Oscar Company",
      provider: "The Nils Oscar Company AB",
      productionyear: "",
      testedproductionyear: "",
      alcoholstrength: "9.4%",
      module: "T5",
      assortment: "TSE",
      organic: "1",
      kosher: "0",
      type: "Beer",
      gluten: "1",
      tannin: "1",
      stock: 4,
    },
    {
      nr: "1101003",
      articleid: "665836",
      articletype: "11010",
      name: "Corsendonk Christmas Ale",
      name2: "",
      price: "20.90",
      volumeml: null,
      priceperlitre: null,
      introduced: "2012-11-15",
      finaldelivery: " ",
      catgegory: "\u00c3\u2013l, Ale",
      packaging: "Flaska",
      captype: "",
      countryoforigin: "",
      countryoforiginlandname: "Belgien",
      producer: "Brouwerij Corsendonk",
      provider: "AB Wicked Wine Sweden",
      productionyear: "",
      testedproductionyear: "",
      alcoholstrength: "8.1%",
      module: "",
      assortment: "TSS",
      organic: "0",
      kosher: "0",
      type: "Beer",
      gluten: "1",
      tannin: "1",
      stock: 30,
    },
    {
      nr: "1101203",
      articleid: "766235",
      articletype: "11012",
      name: "Flying Dog",
      name2: "K-9 Cruiser Winter Ale",
      price: "27.30",
      volumeml: null,
      priceperlitre: null,
      introduced: "2013-11-15",
      finaldelivery: " ",
      catgegory: "\u00c3\u2013l, Ale",
      packaging: "Flaska",
      captype: "",
      countryoforigin: "",
      countryoforiginlandname: "USA",
      producer: "Flying Dog Brewery",
      provider: "AB Wicked Wine Sweden",
      productionyear: "",
      testedproductionyear: "",
      alcoholstrength: "7.4%",
      module: "",
      assortment: "TSS",
      organic: "0",
      kosher: "1",
      type: "Beer",
      gluten: "1",
      tannin: "1",
      stock: 10,
    },
    {
      nr: "1104303",
      articleid: "721432",
      articletype: "11043",
      name: "Omnipollo Nebuchadnezzar",
      name2: "",
      price: "39.90",
      volumeml: null,
      priceperlitre: null,
      introduced: "2013-02-01",
      finaldelivery: " ",
      catgegory: "\u00c3\u2013l, Ale",
      packaging: "Flaska",
      captype: "",
      countryoforigin: "",
      countryoforiginlandname: "Internationellt m\u00c3\u00a4rke",
      producer: "Omnipollo",
      provider: "Brill & Co AB",
      productionyear: "",
      testedproductionyear: "",
      alcoholstrength: "8.5%",
      module: "",
      assortment: "TSE",
      organic: "1",
      kosher: "0",
      type: "Beer",
      gluten: "1",
      tannin: "0",
      stock: 3,
    },
    {
      nr: "1104803",
      articleid: "722671",
      articletype: "11048",
      name: "Suruga Bay",
      name2: "Imperial IPA",
      price: "59.90",
      volumeml: null,
      priceperlitre: null,
      introduced: "2013-04-02",
      finaldelivery: " ",
      catgegory: "\u00c3\u2013l, Ale",
      packaging: "Flaska",
      captype: "",
      countryoforigin: "",
      countryoforiginlandname: "Japan",
      producer: "Baird Brewing Co",
      provider: "Cask Sweden AB",
      productionyear: "",
      testedproductionyear: "",
      alcoholstrength: "7.5%",
      module: "T7",
      assortment: "TSE",
      organic: "0",
      kosher: "0",
      type: "Beer",
      gluten: "0",
      tannin: "1",
      stock: 4,
    },
    {
      nr: "1104903",
      articleid: "722706",
      articletype: "11049",
      name: "Rising Sun",
      name2: "Pale Ale",
      price: "59.90",
      volumeml: null,
      priceperlitre: null,
      introduced: "2013-04-02",
      finaldelivery: " ",
      catgegory: "\u00c3\u2013l, Ale",
      packaging: "Flaska",
      captype: "",
      countryoforigin: "",
      countryoforiginlandname: "Japan",
      producer: "Baird Brewing Co",
      provider: "Cask Sweden AB",
      productionyear: "",
      testedproductionyear: "",
      alcoholstrength: "5%",
      module: "",
      assortment: "TSE",
      organic: "0",
      kosher: "1",
      type: "Beer",
      gluten: "1",
      tannin: "1",
      stock: 10,
    },
    {
      nr: "1105603",
      articleid: "723541",
      articletype: "11056",
      name: "Vuur & Vlam",
      name2: "IPA",
      price: "26.90",
      volumeml: null,
      priceperlitre: null,
      introduced: "2013-02-01",
      finaldelivery: " ",
      catgegory: "\u00c3\u2013l, Ale",
      packaging: "Flaska",
      captype: "",
      countryoforigin: "",
      countryoforiginlandname: "Nederl\u00c3\u00a4nderna",
      producer: "Brouwerij De Molen",
      provider: "Galatea Spirits AB",
      productionyear: "",
      testedproductionyear: "",
      alcoholstrength: "6.2%",
      module: "T5",
      assortment: "TSE",
      organic: "0",
      kosher: "0",
      type: "Beer",
      gluten: "0",
      tannin: "0",
      stock: 6,
    },
    {
      nr: "1105901",
      articleid: "724472",
      articletype: "11059",
      name: "Ichtegems",
      name2: "Grand Cru Cuv\u00c3\u00a9e",
      price: "63.00",
      volumeml: null,
      priceperlitre: null,
      introduced: "2013-04-02",
      finaldelivery: " ",
      catgegory: "\u00c3\u2013l, Ale",
      packaging: "Flaska",
      captype: "",
      countryoforigin: "",
      countryoforiginlandname: "Belgien",
      producer: "Brouwerij Strubbe",
      provider: "Belgodeli",
      productionyear: "2010",
      testedproductionyear: "2010",
      alcoholstrength: "6.5%",
      module: "T5",
      assortment: "TSE",
      organic: "0",
      kosher: "1",
      type: "Beer",
      gluten: "1",
      tannin: "1",
      stock: 18,
    },
    {
      nr: "1106901",
      articleid: "730955",
      articletype: "11069",
      name: "The Sinner Series Sloth",
      name2: "Amager",
      price: "44.90",
      volumeml: null,
      priceperlitre: null,
      introduced: "2013-03-01",
      finaldelivery: " ",
      catgegory: "\u00c3\u2013l, Ale",
      packaging: "Flaska",
      captype: "",
      countryoforigin: "",
      countryoforiginlandname: "Danmark",
      producer: "Amager Bryghus",
      provider: "Elixir HB",
      productionyear: "",
      testedproductionyear: "",
      alcoholstrength: "6%",
      module: "",
      assortment: "TSE",
      organic: "0",
      kosher: "0",
      type: "Beer",
      gluten: "1",
      tannin: "1",
      stock: 10,
    },
    //Wine
    {
      nr: "1279801",
      articleid: "15536",
      articletype: "12798",
      name: "Castillo de Gredos",
      name2: "White wine",
      price: "55.00",
      volumeml: null,
      priceperlitre: null,
      introduced: "1998-05-04",
      finaldelivery: " ",
      catgegory: "Vitt vin,  L\u00c3\u00a4tt & Avrundat",
      packaging: "Papp",
      captype: "",
      countryoforigin: "",
      countryoforiginlandname: "Spanien",
      producer: "Bodegas Vinartis",
      provider: "Prime Wine Sweden AB",
      productionyear: "",
      testedproductionyear: "",
      alcoholstrength: "12%",
      module: "",
      assortment: "FS",
      organic: "1",
      kosher: "1",
      type: "Wine",
      gluten: "1",
      tannin: "1",
      stock: 15,
    },
    {
      nr: "7416501",
      articleid: "852603",
      articletype: "74165",
      name: "Piedrasassi",
      name2: "White Wine",
      price: "528.00",
      volumeml: null,
      priceperlitre: null,
      introduced: "2014-05-02",
      finaldelivery: " ",
      catgegory: "Vitt vin",
      packaging: "Flaska",
      captype: "Naturkork",
      countryoforigin: "Kalifornien, Central Coast",
      countryoforiginlandname: "USA",
      producer: "Piedrasassi",
      provider: "Vinopia Wine & Spirit AB",
      productionyear: "2010",
      testedproductionyear: "",
      alcoholstrength: "14%",
      module: "",
      assortment: "BS",
      organic: "0",
      kosher: "0",
      type: "Wine",
      gluten: "1",
      tannin: "1",
      stock: 20,
    },
    {
      nr: "1289008",
      articleid: "43331",
      articletype: "12890",
      name: "Cape Original",
      name2: "Shiraz Cabernet Sauvignon",
      price: "189.00",
      volumeml: null,
      priceperlitre: null,
      introduced: "2004-05-03",
      finaldelivery: " ",
      catgegory: "R\u00c3\u00b6tt vin, Mjukt & B\u00c3\u00a4rigt",
      packaging: "Box",
      captype: "Vridtapp",
      countryoforigin: "Western Cape",
      countryoforiginlandname: "Sydafrika",
      producer: "Origin Wine",
      provider: "Origin Nordic",
      productionyear: "2014",
      testedproductionyear: "2014",
      alcoholstrength: "13%",
      module: "",
      assortment: "FS",
      organic: "1",
      kosher: "0",
      type: "Wine",
      gluten: "1",
      tannin: "1",
      stock: 7,
    },
    {
      nr: "1279708",
      articleid: "22289",
      articletype: "12797",
      name: "Castillo de Gredos",
      name2: "Red Wine",
      price: "129.00",
      volumeml: null,
      priceperlitre: null,
      introduced: "2000-02-07",
      finaldelivery: " ",
      catgegory: "R\u00c3\u00b6tt vin, Mjukt & B\u00c3\u00a4rigt",
      packaging: "Box",
      captype: "Vingtapp",
      countryoforigin: "",
      countryoforiginlandname: "Spanien",
      producer: "Bodegas Vinartis",
      provider: "Prime Wine Sweden AB",
      productionyear: "",
      testedproductionyear: "",
      alcoholstrength: "13%",
      module: "",
      assortment: "FS",
      organic: "0",
      kosher: "0",
      type: "Wine",
      gluten: "1",
      tannin: "1",
      stock: 20,
    },
    {
      nr: "7309701",
      articleid: "709583",
      articletype: "73097",
      name: "DouRosa",
      name2: "Red Wine",
      price: "129.00",
      volumeml: null,
      priceperlitre: null,
      introduced: "2012-11-01",
      finaldelivery: " ",
      catgegory: "R\u00c3\u00b6tt vin",
      packaging: "Flaska",
      captype: "",
      countryoforigin: "Douro",
      countryoforiginlandname: "Portugal",
      producer: "Quinta de la Rosa",
      provider: "TOMP Beer Wine & Spirits AB",
      productionyear: "2010",
      testedproductionyear: "",
      alcoholstrength: "13.5%",
      module: "",
      assortment: "BS",
      organic: "0",
      kosher: "0",
      type: "Wine",
      gluten: "1",
      tannin: "1",
      stock: 10,
    },
    {
      nr: "7368801",
      articleid: "799758",
      articletype: "73688",
      name: "Jayson",
      name2: "Red Wine",
      price: "599.00",
      volumeml: null,
      priceperlitre: null,
      introduced: "2013-11-01",
      finaldelivery: " ",
      catgegory: "R\u00c3\u00b6tt vin",
      packaging: "Flaska",
      captype: "",
      countryoforigin: "Kalifornien, North Coast, Napa Valley",
      countryoforiginlandname: "USA",
      producer: "Pahlmeyer",
      provider: "Divine AB",
      productionyear: "2010",
      testedproductionyear: "",
      alcoholstrength: "15%",
      module: "",
      assortment: "BS",
      organic: "0",
      kosher: "0",
      type: "Wine",
      gluten: "0",
      tannin: "0",
      stock: 30,
    },
    {
      nr: "8327101",
      articleid: "258235",
      articletype: "83271",
      name: "Quinta de Chocapalha",
      name2: "Red Wine",
      price: "109.00",
      volumeml: null,
      priceperlitre: null,
      introduced: "2007-05-02",
      finaldelivery: " ",
      catgegory: "R\u00c3\u00b6tt vin",
      packaging: "Flaska",
      captype: "",
      countryoforigin: "Estremadura",
      countryoforiginlandname: "Portugal",
      producer: "Quinta de Chocapalha",
      provider: "Handpicked Wines Sweden AB",
      productionyear: "2009",
      testedproductionyear: "",
      alcoholstrength: "14.5%",
      module: "",
      assortment: "BS",
      organic: "1",
      kosher: "0",
      type: "Wine",
      gluten: "1",
      tannin: "1",
      stock: 25,
    },
    {
      nr: "7360501",
      articleid: "799701",
      articletype: "73605",
      name: "Pahlmeyer",
      name2: "Red Wine",
      price: "1299.00",
      volumeml: null,
      priceperlitre: null,
      introduced: "2013-11-01",
      finaldelivery: " ",
      catgegory: "R\u00c3\u00b6tt vin",
      packaging: "Flaska",
      captype: "",
      countryoforigin: "Kalifornien, North Coast, Napa Valley",
      countryoforiginlandname: "USA",
      producer: "Pahlmeyer",
      provider: "Divine AB",
      productionyear: "2008",
      testedproductionyear: "",
      alcoholstrength: "15%",
      module: "",
      assortment: "BS",
      organic: "0",
      kosher: "0",
      type: "Wine",
      gluten: "1",
      tannin: "0",
      stock: 16,
    },
    {
      nr: "7987409",
      articleid: "778215",
      articletype: "79874",
      name: "Vinowine",
      name2: "Rosso",
      price: "367.00",
      volumeml: null,
      priceperlitre: null,
      introduced: "2013-08-01",
      finaldelivery: " ",
      catgegory: "R\u00c3\u00b6tt vin",
      packaging: "Box",
      captype: "",
      countryoforigin: "",
      countryoforiginlandname: "Italien",
      producer: "Santa Maria La Palma",
      provider: "La Bottega delle Sorelle AB",
      productionyear: "2012",
      testedproductionyear: "",
      alcoholstrength: "13%",
      module: "",
      assortment: "BS",
      organic: "1",
      kosher: "0",
      type: "Wine",
      gluten: "0",
      tannin: "1",
      stock: 12,
    },
    //Spirit
    {
      nr: "10001",
      artikelid: "25053",
      varnummer: "100",
      name: "Braastad XO",
      name2: "",
      price: "442.00",
      volymiml: null,
      prisperliter: null,
      saljstart: "2000-08-07",
      slutlev: " ",
      category: "Cognac",
      forpackning: "Flaska",
      forslutning: "Naturkork",
      ursprung: "Cognac, Fine Champagne",
      ursprunglandname: "Frankrike",
      producent: "Tiffon",
      leverantor: "Arcus Sweden AB",
      argang: "",
      provadargang: "",
      alcoholstrength: "40%",
      modul: "",
      sortiment: "FS",
      ekologisk: "0",
      koscher: "0",
      type: "Spirit",
      gluten: "1",
      tannin: "1",
      stock: 18,
    },
    {
      nr: "1005001",
      articleid: "733084",
      articletype: "10050",
      name: "Balcones Texas",
      name2: "",
      price: "899.00",
      volumeml: null,
      priceperlitre: null,
      introduced: "2013-03-01",
      finaldelivery: " ",
      catgegory: "Whisky, Malt",
      packaging: "Flaska",
      captype: "",
      countryoforigin: "",
      countryoforiginlandname: "USA",
      producer: "Balcones Distilling",
      provider: "Cask Sweden AB",
      productionyear: "",
      testedproductionyear: "",
      alcoholstrength: "52.2%",
      module: "",
      assortment: "TSE",
      organic: "0",
      kosher: "0",
      type: "Spirit",
      gluten: "1",
      tannin: "1",
      stock: 23,
    },
    {
      nr: "1005401",
      articleid: "733429",
      articletype: "10054",
      name: "Linkwood",
      name2: "the Octave",
      price: "1159.00",
      volumeml: null,
      priceperlitre: null,
      introduced: "2013-03-01",
      finaldelivery: " ",
      catgegory: "Whisky, Malt",
      packaging: "Flaska",
      captype: "",
      countryoforigin: "Skottland, Highlands, Speyside",
      countryoforiginlandname: "Storbritannien",
      producer: "Duncan Taylor Scotch Whisky",
      provider: "Clydesdale AB",
      productionyear: "1989",
      testedproductionyear: "",
      alcoholstrength: "51.7%",
      module: "",
      assortment: "TSE",
      organic: "0",
      kosher: "0",
      type: "Spirit",
      gluten: "1",
      tannin: "1",
      stock: 5,
    },
    {
      nr: "1011701",
      articleid: "734763",
      articletype: "10117",
      name: "The Arran Malt",
      name2: "Orkney Bere",
      price: "579.00",
      volumeml: null,
      priceperlitre: null,
      introduced: "2013-04-02",
      finaldelivery: " ",
      catgegory: "Whisky, Malt",
      packaging: "Flaska",
      captype: "",
      countryoforigin: "Skottland, Highlands, Islands, Arran",
      countryoforiginlandname: "Storbritannien",
      producer: "Isle of Arran Distillers",
      provider: "Cask Sweden AB",
      productionyear: "",
      testedproductionyear: "",
      alcoholstrength: "46%",
      module: "T7",
      assortment: "TSE",
      organic: "0",
      kosher: "0",
      type: "Spirit",
      gluten: "0",
      tannin: "1",
      stock: 15,
    },
    {
      nr: "1012601",
      articleid: "874805",
      articletype: "10126",
      name: "Nikka Taketsuru",
      name2: "Pure Malt",
      price: "549.00",
      volumeml: null,
      priceperlitre: null,
      introduced: "2014-10-03",
      finaldelivery: " ",
      catgegory: "Whisky, Malt",
      packaging: "Flaska",
      captype: "",
      countryoforigin: "",
      countryoforiginlandname: "Japan",
      producer: "The Nikka Whisky Distilling Co",
      provider: "Symposion International AB",
      productionyear: "",
      testedproductionyear: "",
      alcoholstrength: "43%",
      module: "",
      assortment: "TSE",
      organic: "0",
      kosher: "1",
      type: "Spirit",
      gluten: "1",
      tannin: "0",
      stock: 18,
    },
    {
      nr: "1019202",
      articleid: "817010",
      articletype: "10192",
      name: "Strane",
      name2: "London Dry Gin",
      price: "401.00",
      volumeml: null,
      priceperlitre: null,
      introduced: "2014-04-01",
      finaldelivery: " ",
      catgegory: "Gin",
      packaging: "Flaska",
      captype: "",
      countryoforigin: "",
      countryoforiginlandname: "Sverige",
      producer: "Sm\u00c3\u00b6gen Whisky AB",
      provider: "Sm\u00c3\u00b6gen Whisky AB",
      productionyear: "",
      testedproductionyear: "",
      alcoholstrength: "47.4%",
      module: "",
      assortment: "TSE",
      organic: "0",
      kosher: "0",
      type: "Spirit",
      gluten: "0",
      tannin: "0",
      stock: 12,
    },
    {
      nr: "1019301",
      articleid: "611828",
      articletype: "10193",
      name: "Greenall's Berkeley Square",
      name2: "",
      price: "499.00",
      volumeml: null,
      priceperlitre: null,
      introduced: "2012-03-01",
      finaldelivery: " ",
      catgegory: "Gin",
      packaging: "Flaska",
      captype: "Naturkork",
      countryoforigin: "",
      countryoforiginlandname: "Storbritannien",
      producer: "G & J Greenall",
      provider: "Interbrands Sweden AB",
      productionyear: "",
      testedproductionyear: "",
      alcoholstrength: "40%",
      module: "",
      assortment: "TST",
      organic: "0",
      kosher: "0",
      type: "Spirit",
      gluten: "1",
      tannin: "1",
      stock: 19,
    },
    {
      nr: "1019701",
      articleid: "673516",
      articletype: "10197",
      name: "Danica Gin",
      name2: "",
      price: "369.00",
      volumeml: null,
      priceperlitre: null,
      introduced: "2012-08-01",
      finaldelivery: " ",
      catgegory: "Gin",
      packaging: "Flaska",
      captype: "Naturkork",
      countryoforigin: "",
      countryoforiginlandname: "Danmark",
      producer: "Bryghuset Braunstein",
      provider: "Galatea Spirits AB",
      productionyear: "",
      testedproductionyear: "",
      alcoholstrength: "44.7%",
      module: "",
      assortment: "TSE",
      organic: "0",
      kosher: "0",
      type: "Spirit",
      gluten: "1",
      tannin: "1",
      stock: 12,
    },
    {
      nr: "1023901",
      articleid: "195565",
      articletype: "10239",
      name: "Tanqueray",
      name2: "London Dry Gin",
      price: "279.00",
      volumeml: null,
      priceperlitre: null,
      introduced: "2006-04-01",
      finaldelivery: " ",
      catgegory: "Gin",
      packaging: "Flaska",
      captype: "Skruvkapsyl",
      countryoforigin: "",
      countryoforiginlandname: "Storbritannien",
      producer: "Tanqueray Gordon",
      provider: "Diageo Sweden AB",
      productionyear: "",
      testedproductionyear: "",
      alcoholstrength: "43.1%",
      module: "",
      assortment: "FS",
      organic: "0",
      kosher: "1",
      type: "Spirit",
      gluten: "1",
      tannin: "1",
      stock: 2,
    },
  ],
  orders: [
    {
      order_nr: "001",
      username: "Mike Miller",
      table_number: "10",
      type: "table",
      status: "fullfilled",
      items: [
        {
          nr: "1004703",
          name: "Nils Oscar",
          quantity: 1,
          price:"43.70"
        },
      ],
      amount: "43.70",
    },
    {
      order_nr: "002",
      username: "Emma Smith",
      table_number: "",
      type: "bar",
      status: "fullfilled",
      items: [
        {
          nr: "1004703",
          name: "Nils Oscar",
          quantity: 1,
          price:"43.70",
        },
        {
          nr: "1101003",
          name: "Corsendonk Christmas Ale",
          quantity: 2,
          price:"20.90",
        },
      ],
      amount: "85.50",
    },
  ],
};
