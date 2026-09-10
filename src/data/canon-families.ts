import type { Canon } from './canon';

/**
 * Generated from data/canon/*.json by scripts/build-canon.mjs — do not edit.
 *
 * Families are authored as data so they can be written or reviewed without
 * touching TypeScript. Run the script after changing any of them.
 */
export const CANON_FAMILIES: Canon[] = [
  {
    "slug": "braise",
    "name": "Braise",
    "standfirst": "Sixteen dishes and one method: a cut that will not cook fast, a covered pot, a low fire, and hours. What separates them is what the liquid is, whether the meat browns before it goes in, whether that liquid ends up a sauce or stays a broth — and what was already frying in the pot when it arrived.",
    "root": "A cut that needs time · liquid in a covered pot · low heat · hours",
    "facets": [
      {
        "id": "liquid",
        "label": "Liquid"
      },
      {
        "id": "start",
        "label": "Start"
      },
      {
        "id": "finish",
        "label": "Finish"
      },
      {
        "id": "base",
        "label": "Aromatic base"
      },
      {
        "id": "region",
        "label": "Region"
      }
    ],
    "nestings": [
      {
        "label": "By liquid",
        "by": [
          "liquid",
          "start",
          "finish"
        ]
      },
      {
        "label": "By what you end up with",
        "by": [
          "finish",
          "start",
          "liquid"
        ]
      },
      {
        "label": "By region",
        "by": [
          "region",
          "liquid"
        ]
      }
    ],
    "dishes": [
      {
        "name": "Boeuf bourguignon",
        "facets": {
          "region": [
            "France",
            "Burgundy"
          ],
          "liquid": [
            "wine",
            "red Burgundy"
          ],
          "start": [
            "meat browned first",
            "lardons rendered before it",
            "dusted with flour"
          ],
          "finish": [
            "reduces to a sauce",
            "glossy from the flour"
          ],
          "base": [
            "onion",
            "carrot",
            "garlic",
            "bouquet garni"
          ]
        },
        "note": "The flour is not a shortcut. A braise cannot thicken itself past a point, and every dish in this family answers that somehow — here with wheat."
      },
      {
        "name": "Gulyás",
        "facets": {
          "region": [
            "Hungary"
          ],
          "liquid": [
            "water",
            "enough to cover"
          ],
          "start": [
            "meat goes in raw",
            "onions fried first",
            "paprika stirred in off the heat"
          ],
          "finish": [
            "stays a broth",
            "potatoes cooked in it"
          ],
          "base": [
            "onion",
            "sweet paprika",
            "caraway"
          ]
        },
        "note": "In Hungary this is a soup you eat with a spoon. What the rest of the world calls goulash is the next row down."
      },
      {
        "name": "Pörkölt",
        "facets": {
          "region": [
            "Hungary"
          ],
          "liquid": [
            "water",
            "barely any"
          ],
          "start": [
            "meat goes in raw",
            "onions fried first",
            "paprika stirred in off the heat"
          ],
          "finish": [
            "reduces to a sauce",
            "clings to the meat"
          ],
          "base": [
            "onion",
            "sweet paprika",
            "caraway"
          ]
        },
        "note": "Identical to gulyás up to the moment you decide how much water goes in. Under a ladle and it becomes a sauce; over, and it stays a soup."
      },
      {
        "name": "Pot roast",
        "facets": {
          "region": [
            "United States"
          ],
          "liquid": [
            "stock",
            "beef stock"
          ],
          "start": [
            "meat browned first",
            "vegetables browned after"
          ],
          "finish": [
            "reduces to a sauce",
            "strained into gravy"
          ],
          "base": [
            "onion",
            "carrot",
            "celery"
          ]
        },
        "note": "The plainest version in the family — no wine, no paste, nothing fermented. All of the flavour has to come out of the browning, which is why it is the one dish here you cannot make without it."
      },
      {
        "name": "Tagine",
        "facets": {
          "region": [
            "Morocco"
          ],
          "liquid": [
            "water",
            "a splash only"
          ],
          "start": [
            "meat goes in raw",
            "turned in the spices cold"
          ],
          "finish": [
            "reduces to a sauce",
            "the conical lid returns the steam"
          ],
          "base": [
            "onion",
            "ginger",
            "saffron",
            "preserved lemon"
          ]
        },
        "note": "Barely any liquid goes in because barely any gets out. The cone condenses the steam and drops it back — the pot is the recipe."
      },
      {
        "name": "Doro wat",
        "facets": {
          "region": [
            "Ethiopia"
          ],
          "liquid": [
            "water",
            "added a ladle at a time"
          ],
          "start": [
            "meat goes in raw",
            "onions cooked dry without fat"
          ],
          "finish": [
            "reduces to a sauce",
            "spiced butter separates on top"
          ],
          "base": [
            "onion",
            "berbere",
            "niter kibbeh"
          ]
        },
        "note": "Six onions go into a dry pot for the best part of an hour before any fat does. They give up their water and collapse to a paste, and that paste is the sauce."
      },
      {
        "name": "Ghormeh sabzi",
        "facets": {
          "region": [
            "Iran"
          ],
          "liquid": [
            "water",
            "enough to cover"
          ],
          "start": [
            "meat browned first",
            "herbs fried separately until dark"
          ],
          "finish": [
            "reduces to a sauce",
            "oil rises to the surface"
          ],
          "base": [
            "onion",
            "parsley",
            "leek",
            "fenugreek leaf",
            "dried lime"
          ]
        },
        "note": "The herbs — parsley, leek and fenugreek in roughly that order of volume — are fried almost to black in their own pan before they meet the meat. Stop short and the stew tastes green rather than deep."
      },
      {
        "name": "Korma",
        "facets": {
          "region": [
            "India",
            "the Mughal court"
          ],
          "liquid": [
            "yoghurt",
            "cream"
          ],
          "start": [
            "meat browned first",
            "whole spices bloomed in ghee"
          ],
          "finish": [
            "reduces to a sauce",
            "thickened with ground almonds"
          ],
          "base": [
            "onion",
            "ginger",
            "garlic",
            "green cardamom"
          ]
        },
        "note": "The only liquid here that must not split. Rendang's breaks on purpose and the dish is built on it; yoghurt breaking is the end of a korma, which is why low heat here is not patience but the entire constraint."
      },
      {
        "name": "Rendang",
        "facets": {
          "region": [
            "Indonesia",
            "West Sumatra"
          ],
          "liquid": [
            "coconut milk",
            "thick"
          ],
          "start": [
            "meat goes in raw",
            "into the spice paste cold"
          ],
          "finish": [
            "the liquid cooks away",
            "the meat fries in the released oil"
          ],
          "base": [
            "shallot",
            "galangal",
            "lemongrass",
            "turmeric leaf"
          ]
        },
        "note": "It stops being a braise before it is done. Once the coconut milk breaks the pot is frying, and that last hour is what lets it keep for a week without a fridge."
      },
      {
        "name": "Massaman",
        "facets": {
          "region": [
            "Thailand"
          ],
          "liquid": [
            "coconut milk",
            "tamarind water"
          ],
          "start": [
            "meat goes in raw",
            "paste fried in cracked coconut cream"
          ],
          "finish": [
            "reduces to a sauce",
            "loose enough to spoon over rice"
          ],
          "base": [
            "shallot",
            "lemongrass",
            "cinnamon",
            "roasted peanut"
          ]
        },
        "note": "The same milk as rendang taken to the opposite end — stopped while it is still a sauce instead of driven until it fries."
      },
      {
        "name": "Adobo",
        "facets": {
          "region": [
            "Philippines"
          ],
          "liquid": [
            "vinegar",
            "soy sauce"
          ],
          "start": [
            "meat goes in raw",
            "marinated in the braising liquid"
          ],
          "finish": [
            "reduces to a sauce",
            "the pork fat renders into it"
          ],
          "base": [
            "garlic",
            "bay",
            "black peppercorn"
          ]
        },
        "note": "Three aromatics and nothing else. The vinegar is not seasoning — it is what kept a pot of pork edible in the tropics before there was anywhere cold to put it."
      },
      {
        "name": "Humba",
        "parent": "Adobo",
        "facets": {
          "region": [
            "Philippines"
          ],
          "liquid": [
            "vinegar",
            "soy sauce"
          ],
          "start": [
            "meat goes in raw",
            "marinated in the braising liquid"
          ],
          "finish": [
            "reduces to a sauce",
            "palm sugar takes it to a glaze"
          ],
          "base": [
            "garlic",
            "bay",
            "black peppercorn",
            "fermented black beans",
            "dried banana blossom"
          ]
        },
        "note": "Adobo plus palm sugar and tausi — it descends from adobo, not from the base. Its other ancestor is Hokkien: hong bak, the red-braised pork that came to the Visayas with Fujianese traders and met adobo there. Cooks in the Visayas make both and will tell you which house makes which."
      },
      {
        "name": "Kare-kare",
        "facets": {
          "region": [
            "Philippines"
          ],
          "liquid": [
            "water",
            "enough to cover the oxtail"
          ],
          "start": [
            "meat goes in raw",
            "oxtail simmered plain for hours"
          ],
          "finish": [
            "reduces to a sauce",
            "ground peanuts stirred in"
          ],
          "base": [
            "onion",
            "garlic",
            "annatto",
            "toasted ground rice"
          ]
        },
        "note": "Deliberately under-salted in the pot. The seasoning arrives at the table as a spoonful of bagoong beside it, so each eater decides how salty their own bowl is."
      },
      {
        "name": "Hong shao rou",
        "facets": {
          "region": [
            "China"
          ],
          "liquid": [
            "soy sauce",
            "Shaoxing wine"
          ],
          "start": [
            "meat browned first",
            "blanched before that",
            "sugar caramelised in the pan"
          ],
          "finish": [
            "the liquid cooks away",
            "what is left glazes the meat"
          ],
          "base": [
            "ginger",
            "spring onion",
            "star anise",
            "cassia bark"
          ]
        },
        "note": "The sugar is caramelised in the dry pan before anything else goes near it. The red in red-braised is caramel at least as much as it is soy."
      },
      {
        "name": "Birria",
        "facets": {
          "region": [
            "Mexico",
            "Jalisco"
          ],
          "liquid": [
            "water",
            "the chilli soaking liquid"
          ],
          "start": [
            "meat goes in raw",
            "marinated in the chilli paste"
          ],
          "finish": [
            "stays a broth",
            "the consomé served alongside"
          ],
          "base": [
            "guajillo chilli",
            "ancho chilli",
            "cumin",
            "clove"
          ]
        },
        "note": "The broth is not a by-product waiting to be reduced away — it comes to the table in its own cup. Gulyás makes the same call from the other side of the world."
      },
      {
        "name": "Seco de cordero",
        "facets": {
          "region": [
            "Peru"
          ],
          "liquid": [
            "blended coriander",
            "chicha de jora"
          ],
          "start": [
            "meat browned first",
            "the purée poured over after"
          ],
          "finish": [
            "reduces to a sauce",
            "thick enough to be called dry"
          ],
          "base": [
            "onion",
            "garlic",
            "ají amarillo",
            "cumin"
          ]
        },
        "note": "Seco means dry — not because it is, but because it finishes thick where the soups beside it stay loose. The braising liquid is a blender full of coriander, and beer stands in for the chicha almost everywhere now."
      }
    ],
    "notes": [
      {
        "title": "On the first fork",
        "body": "Browning is not obligatory, and the split is not east against west. Six of these sear the meat before a drop of liquid arrives — bourguignon, pot roast, ghormeh sabzi, korma, seco and hong shao rou — and much of what they taste of comes out of that crust. The other ten skip the sear, for two different reasons. Four put raw meat into a base that has already been cooked: fried onions for gulyás and pörkölt, dry onions for doro wat, cracked coconut cream for massaman. Five go in on something raw and cold — the spices of a tagine, rendang's pounded paste, the vinegar of adobo and humba, birria's chilli marinade — because a paste hot enough to brown meat is a paste that has scorched. Kare-kare is the tenth and a case of its own: oxtail into plain water for hours, and everything else added at the end."
      },
      {
        "title": "Sauce or broth",
        "body": "The same pot can end up in three places, and the decision is only how much liquid goes in and when you stop. Twelve reduce to a sauce. Gulyás and birria stay a broth on purpose and are served as one. Rendang and hong shao rou go past sauce entirely: the liquid cooks away and the meat finishes in what is left — frying in released oil, glazing in caramel and soy — which is why both keep far longer than the rest."
      },
      {
        "title": "What thickens it",
        "body": "Meat and water will not become a sauce by themselves, and the answers divide into borrowing and reducing. The borrowers bring something starchy or ground: flour in bourguignon, ground almonds in korma, ground peanuts and toasted rice in kare-kare, and the pot roast's liquid strained off and thickened separately as gravy. The rest build the body out of the aromatics, or never add much water to begin with — a collapsed kilo of onions in doro wat, the fried onions of pörkölt doing the same work more quietly, a tagine that starts with a splash because its lid hands the splash back, and seco reduced until it earns its name. Read the finish column against the aromatic base beside it and the family sorts itself."
      }
    ],
    "sources": [
      {
        "label": "Braising (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Braising"
      },
      {
        "label": "Pörkölt",
        "url": "https://en.wikipedia.org/wiki/P%C3%B6rk%C3%B6lt"
      },
      {
        "label": "Doro wat",
        "url": "https://en.wikipedia.org/wiki/Doro_wat"
      },
      {
        "label": "Rendang",
        "url": "https://en.wikipedia.org/wiki/Rendang"
      },
      {
        "label": "Humba",
        "url": "https://en.wikipedia.org/wiki/Humba"
      },
      {
        "label": "Birria",
        "url": "https://en.wikipedia.org/wiki/Birria"
      },
      {
        "label": "Tagine",
        "url": "https://en.wikipedia.org/wiki/Tagine"
      },
      {
        "label": "Ghormeh sabzi",
        "url": "https://en.wikipedia.org/wiki/Ghormeh_sabzi"
      },
      {
        "label": "Seco de cordero (Great British Chefs)",
        "url": "https://www.greatbritishchefs.com/recipes/seco-de-cordero-recipe"
      }
    ],
    "yours": [
      "braise",
      "braised",
      "stew",
      "tagine",
      "adobo",
      "rendang",
      "goulash",
      "gulyas",
      "gulyás",
      "pörkölt",
      "birria",
      "pot roast",
      "bourguignon",
      "kare-kare",
      "massaman",
      "korma",
      "doro wat",
      "ghormeh sabzi",
      "hong shao",
      "humba",
      "seco de cordero"
    ]
  },
  {
    "slug": "custard",
    "name": "Custard",
    "standfirst": "Cream, egg yolk and sugar go into all of these. What separates them is how it is cooked, what sets it, and what happens to the surface.",
    "root": "Cream · egg yolk · sugar",
    "facets": [
      {
        "id": "cook",
        "label": "Cooked"
      },
      {
        "id": "set",
        "label": "Set by"
      },
      {
        "id": "finish",
        "label": "Finish"
      },
      {
        "id": "region",
        "label": "Region"
      }
    ],
    "nestings": [
      {
        "label": "By technique",
        "by": [
          "cook",
          "set",
          "finish"
        ]
      },
      {
        "label": "By region",
        "by": [
          "region",
          "cook"
        ]
      }
    ],
    "dishes": [
      {
        "name": "Pastry cream",
        "facets": {
          "region": [
            "France"
          ],
          "cook": [
            "on the stove",
            "stirred"
          ],
          "set": [
            "starch"
          ],
          "finish": []
        },
        "note": "Stirred, so it thickens rather than sets. Everything below is left alone instead."
      },
      {
        "name": "Panna cotta",
        "facets": {
          "region": [
            "Piedmont"
          ],
          "cook": [
            "warmed only"
          ],
          "set": [
            "gelatin"
          ],
          "finish": []
        }
      },
      {
        "name": "Pot de crème",
        "facets": {
          "region": [
            "France"
          ],
          "cook": [
            "baked in a water bath"
          ],
          "set": [
            "egg alone"
          ],
          "finish": []
        }
      },
      {
        "name": "Crème caramel",
        "facets": {
          "region": [
            "France"
          ],
          "cook": [
            "baked in a water bath"
          ],
          "set": [
            "egg alone"
          ],
          "finish": [
            "caramel in the mould"
          ]
        }
      },
      {
        "name": "Crème brûlée",
        "facets": {
          "region": [
            "France"
          ],
          "cook": [
            "baked in a water bath"
          ],
          "set": [
            "egg alone"
          ],
          "finish": [
            "sugar burnt on top"
          ]
        },
        "note": "The crust goes on after the custard is cold, and cracks under a spoon. Without it this is a pot de crème."
      }
    ],
    "notes": [
      {
        "title": "On the surface",
        "body": "Pot de crème, crème caramel and crème brûlée are the same baked custard. All three differ only in the last column — nothing, caramel underneath, or burnt sugar on top — which is as small as a defining difference gets."
      }
    ],
    "sources": [
      {
        "label": "Custard (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Custard"
      },
      {
        "label": "Crème brûlée",
        "url": "https://en.wikipedia.org/wiki/Cr%C3%A8me_br%C3%BBl%C3%A9e"
      },
      {
        "label": "Panna cotta",
        "url": "https://en.wikipedia.org/wiki/Panna_cotta"
      }
    ],
    "yours": [
      "custard",
      "brulee",
      "brûlée",
      "panna cotta",
      "flan",
      "pastry cream"
    ]
  },
  {
    "slug": "dough-with-filling",
    "name": "Dough with filling",
    "standfirst": "Wrap something in a sheet of dough, close it, and apply heat. Nearly every cuisine arrived at this independently — which is why the category is dough-with-filling rather than \"dumpling\", a word that quietly makes one tradition the default.",
    "root": "A sheet of dough, closed around a filling",
    "facets": [
      {
        "id": "dough",
        "label": "Dough"
      },
      {
        "id": "filling",
        "label": "Filling"
      },
      {
        "id": "close",
        "label": "Closed"
      },
      {
        "id": "cook",
        "label": "Cooked"
      },
      {
        "id": "region",
        "label": "Region"
      }
    ],
    "nestings": [
      {
        "label": "By cooking",
        "by": [
          "cook",
          "dough",
          "close"
        ]
      },
      {
        "label": "By dough",
        "by": [
          "dough",
          "cook"
        ]
      },
      {
        "label": "By region",
        "by": [
          "region",
          "cook"
        ]
      }
    ],
    "dishes": [
      {
        "name": "Jiaozi",
        "facets": {
          "dough": [
            "wheat",
            "unleavened"
          ],
          "filling": [
            "pork",
            "chive"
          ],
          "close": [
            "pleated crescent"
          ],
          "cook": [
            "boiled"
          ],
          "region": [
            "China"
          ]
        }
      },
      {
        "name": "Gyoza",
        "facets": {
          "dough": [
            "wheat",
            "unleavened",
            "thinner wrapper"
          ],
          "filling": [
            "pork",
            "cabbage"
          ],
          "close": [
            "pleated crescent"
          ],
          "cook": [
            "pan-fried",
            "then steamed"
          ],
          "region": [
            "Japan"
          ]
        },
        "note": "Jiaozi with a thinner wrapper and a crisp base — the same parcel, finished differently."
      },
      {
        "name": "Xiao long bao",
        "facets": {
          "dough": [
            "wheat",
            "unleavened"
          ],
          "filling": [
            "pork",
            "set aspic"
          ],
          "close": [
            "twisted knot"
          ],
          "cook": [
            "steamed"
          ],
          "region": [
            "Jiangnan"
          ]
        },
        "note": "The aspic melts into soup inside the parcel. The filling is the technique."
      },
      {
        "name": "Momo",
        "facets": {
          "dough": [
            "wheat",
            "unleavened"
          ],
          "filling": [
            "minced meat",
            "aromatics"
          ],
          "close": [
            "pleated purse"
          ],
          "cook": [
            "steamed"
          ],
          "region": [
            "Tibet",
            "Nepal"
          ]
        }
      },
      {
        "name": "Manti",
        "facets": {
          "dough": [
            "wheat",
            "unleavened"
          ],
          "filling": [
            "lamb",
            "onion"
          ],
          "close": [
            "pinched parcel"
          ],
          "cook": [
            "steamed"
          ],
          "region": [
            "Anatolia",
            "Central Asia"
          ]
        }
      },
      {
        "name": "Khinkali",
        "facets": {
          "dough": [
            "wheat",
            "unleavened"
          ],
          "filling": [
            "meat",
            "broth"
          ],
          "close": [
            "twisted knot"
          ],
          "cook": [
            "boiled"
          ],
          "region": [
            "Georgia"
          ]
        }
      },
      {
        "name": "Pelmeni",
        "facets": {
          "dough": [
            "wheat",
            "unleavened"
          ],
          "filling": [
            "minced meat"
          ],
          "close": [
            "sealed round"
          ],
          "cook": [
            "boiled"
          ],
          "region": [
            "Russia",
            "Siberia"
          ]
        }
      },
      {
        "name": "Pierogi",
        "facets": {
          "dough": [
            "wheat",
            "unleavened"
          ],
          "filling": [
            "potato",
            "curd cheese"
          ],
          "close": [
            "crimped half-moon"
          ],
          "cook": [
            "boiled",
            "then pan-fried"
          ],
          "region": [
            "Poland"
          ]
        }
      },
      {
        "name": "Ravioli",
        "facets": {
          "dough": [
            "egg pasta"
          ],
          "filling": [
            "ricotta",
            "greens"
          ],
          "close": [
            "sealed flat"
          ],
          "cook": [
            "boiled"
          ],
          "region": [
            "Italy"
          ]
        }
      },
      {
        "name": "Empanada",
        "facets": {
          "dough": [
            "wheat",
            "enriched with fat"
          ],
          "filling": [
            "beef",
            "olive",
            "egg"
          ],
          "close": [
            "crimped repulgue"
          ],
          "cook": [
            "baked"
          ],
          "region": [
            "Argentina",
            "Spain"
          ]
        }
      },
      {
        "name": "Jamaican patty",
        "facets": {
          "dough": [
            "wheat",
            "flaky",
            "turmeric"
          ],
          "filling": [
            "spiced beef"
          ],
          "close": [
            "crimped half-moon"
          ],
          "cook": [
            "baked"
          ],
          "region": [
            "Jamaica"
          ]
        },
        "note": "The same half-moon as a pierogi, on laminated pastry — the dough is what makes it its own thing."
      },
      {
        "name": "Samosa",
        "facets": {
          "dough": [
            "wheat",
            "unleavened"
          ],
          "filling": [
            "potato",
            "pea",
            "spice"
          ],
          "close": [
            "folded cone"
          ],
          "cook": [
            "deep-fried"
          ],
          "region": [
            "South Asia"
          ]
        }
      },
      {
        "name": "Empanada frita",
        "facets": {
          "dough": [
            "wheat",
            "enriched with fat"
          ],
          "filling": [
            "cheese",
            "beef"
          ],
          "close": [
            "crimped repulgue"
          ],
          "cook": [
            "deep-fried"
          ],
          "region": [
            "Latin America"
          ]
        }
      },
      {
        "name": "Fried wonton",
        "facets": {
          "dough": [
            "wheat",
            "unleavened",
            "thinner wrapper"
          ],
          "filling": [
            "pork",
            "shrimp"
          ],
          "close": [
            "gathered purse"
          ],
          "cook": [
            "deep-fried"
          ],
          "region": [
            "China"
          ]
        }
      }
    ],
    "notes": [
      {
        "title": "On the category",
        "body": "Calling these all dumplings makes gyoza and pierogi look like variations of one another. They are not — they are separate answers to the same problem, arrived at independently. Dough-with-filling names the problem instead of picking a winner, which is why every one of these sits at the same depth."
      },
      {
        "title": "On what actually varies",
        "body": "Filling varies most and matters least; almost any of these parcels tolerates almost any filling. The dough and the closing are what make a shape recognisable, and how it is cooked is what makes it a different eating experience — which is why cooking is the default nesting."
      }
    ],
    "sources": [
      {
        "label": "Dumpling (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Dumpling"
      },
      {
        "label": "Empanada",
        "url": "https://en.wikipedia.org/wiki/Empanada"
      },
      {
        "label": "Jamaican patty",
        "url": "https://en.wikipedia.org/wiki/Jamaican_patty"
      },
      {
        "label": "Xiaolongbao",
        "url": "https://en.wikipedia.org/wiki/Xiaolongbao"
      }
    ],
    "yours": [
      "empanada",
      "pierogi",
      "dumpling",
      "gyoza",
      "ravioli",
      "samosa",
      "patty",
      "wonton"
    ]
  },
  {
    "slug": "egg",
    "name": "Egg",
    "standfirst": "Twelve dishes out of one egg. Almost nothing is added — what separates them is the state the egg is in when it meets heat, and where you stop.",
    "root": "Egg",
    "facets": [
      {
        "id": "state",
        "label": "State"
      },
      {
        "id": "added",
        "label": "Added"
      },
      {
        "id": "method",
        "label": "Method"
      },
      {
        "id": "done",
        "label": "Doneness"
      },
      {
        "id": "region",
        "label": "Region"
      }
    ],
    "nestings": [
      {
        "label": "By technique",
        "by": [
          "state",
          "method",
          "done"
        ]
      },
      {
        "label": "By region",
        "by": [
          "region",
          "state"
        ]
      }
    ],
    "dishes": [
      {
        "name": "Soft-boiled",
        "facets": {
          "region": [],
          "state": [
            "in its shell"
          ],
          "added": [],
          "method": [
            "simmered"
          ],
          "done": [
            "6 minutes"
          ]
        }
      },
      {
        "name": "Hard-boiled",
        "facets": {
          "region": [],
          "state": [
            "in its shell"
          ],
          "added": [],
          "method": [
            "simmered"
          ],
          "done": [
            "10 minutes"
          ]
        }
      },
      {
        "name": "Poached",
        "facets": {
          "region": [],
          "state": [
            "cracked out whole"
          ],
          "added": [],
          "method": [
            "slid into still water"
          ],
          "done": [
            "white just set"
          ]
        }
      },
      {
        "name": "Sunny side up",
        "facets": {
          "region": [
            "United States"
          ],
          "state": [
            "cracked out whole"
          ],
          "added": [],
          "method": [
            "fried in fat",
            "basted"
          ],
          "done": [
            "yolk liquid"
          ]
        }
      },
      {
        "name": "Over easy",
        "facets": {
          "region": [
            "United States"
          ],
          "state": [
            "cracked out whole"
          ],
          "added": [],
          "method": [
            "fried in fat",
            "flipped"
          ],
          "done": [
            "yolk liquid"
          ]
        }
      },
      {
        "name": "Over hard",
        "facets": {
          "region": [
            "United States"
          ],
          "state": [
            "cracked out whole"
          ],
          "added": [],
          "method": [
            "fried in fat",
            "flipped"
          ],
          "done": [
            "yolk set"
          ]
        }
      },
      {
        "name": "Scrambled, French",
        "facets": {
          "region": [
            "France"
          ],
          "state": [
            "beaten"
          ],
          "added": [
            "butter"
          ],
          "method": [
            "stirred in the pan",
            "constantly",
            "low heat"
          ],
          "done": [
            "barely set"
          ]
        },
        "note": "Small curd, almost a sauce. The heat is the whole technique."
      },
      {
        "name": "Scrambled, American",
        "facets": {
          "region": [
            "United States"
          ],
          "state": [
            "beaten"
          ],
          "added": [
            "milk"
          ],
          "method": [
            "stirred in the pan",
            "in folds",
            "higher heat"
          ],
          "done": [
            "firm curds"
          ]
        }
      },
      {
        "name": "French omelette",
        "facets": {
          "region": [
            "France"
          ],
          "state": [
            "beaten"
          ],
          "added": [],
          "method": [
            "poured flat",
            "folded"
          ],
          "done": [
            "no colour"
          ]
        }
      },
      {
        "name": "Tamagoyaki",
        "facets": {
          "region": [
            "Japan"
          ],
          "state": [
            "beaten"
          ],
          "added": [
            "dashi",
            "sugar"
          ],
          "method": [
            "poured flat",
            "rolled in layers"
          ],
          "done": [
            "just set"
          ]
        }
      },
      {
        "name": "Omurice",
        "facets": {
          "region": [
            "Japan"
          ],
          "state": [
            "beaten"
          ],
          "added": [],
          "method": [
            "poured flat",
            "draped over rice"
          ],
          "done": [
            "just set"
          ]
        }
      },
      {
        "name": "Frittata",
        "facets": {
          "region": [
            "Italy"
          ],
          "state": [
            "beaten"
          ],
          "added": [
            "cream"
          ],
          "method": [
            "poured flat",
            "finished in the oven"
          ],
          "done": [
            "cooked through"
          ]
        }
      }
    ],
    "notes": [
      {
        "title": "On the first fork",
        "body": "Beaten or not is the decision everything else hangs off. An unbeaten egg keeps its two textures and the dishes differ by where it cooks; a beaten egg is one material, and the dishes differ by whether you keep it moving or let it set flat."
      }
    ],
    "sources": [
      {
        "label": "Egg as food (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Egg_as_food"
      },
      {
        "label": "Omurice",
        "url": "https://en.wikipedia.org/wiki/Omurice"
      },
      {
        "label": "Tamagoyaki",
        "url": "https://en.wikipedia.org/wiki/Tamagoyaki"
      }
    ],
    "yours": [
      "egg",
      "omelet",
      "omelette",
      "frittata",
      "scrambl"
    ]
  },
  {
    "slug": "fermented-vegetable",
    "name": "Fermented vegetables",
    "standfirst": "Every one of these is a vegetable held under brine, or under its own juice, until lactic bacteria turn it sour — the wild ones that came in on it, or the ones handed over in a starter. What separates them is how the salt gets in, what goes in with it, how cold it is kept and for how long — and whether you stop while it still cracks.",
    "root": "Raw or barely scalded vegetable · held under brine or packed tight · lactic bacteria, wild or from a starter",
    "facets": [
      {
        "id": "salt",
        "label": "Salt"
      },
      {
        "id": "add",
        "label": "Added"
      },
      {
        "id": "keep",
        "label": "Kept"
      },
      {
        "id": "end",
        "label": "Ends up"
      },
      {
        "id": "region",
        "label": "Region"
      }
    ],
    "nestings": [
      {
        "label": "By how the salt goes in",
        "by": [
          "salt",
          "add",
          "keep"
        ]
      },
      {
        "label": "By region",
        "by": [
          "region",
          "salt"
        ]
      },
      {
        "label": "By what it becomes",
        "by": [
          "end",
          "salt",
          "keep"
        ]
      }
    ],
    "dishes": [
      {
        "name": "Sauerkraut",
        "facets": {
          "region": [
            "Germany",
            "Alsace"
          ],
          "salt": [
            "dry-salted",
            "pressed under a weight"
          ],
          "add": [
            "nothing but salt"
          ],
          "keep": [
            "cool cellar",
            "four to six weeks"
          ],
          "end": [
            "goes soft",
            "sharply sour",
            "keeps through winter"
          ]
        },
        "note": "No brine is poured in. The salt pulls one out of the cabbage, and the weight holds the cabbage under it — that is the whole trick."
      },
      {
        "name": "Suan cai",
        "facets": {
          "region": [
            "China",
            "Northeast"
          ],
          "salt": [
            "dry-salted",
            "pressed under a weight",
            "topped up with water"
          ],
          "add": [
            "nothing but salt"
          ],
          "keep": [
            "cold from the start",
            "the whole winter"
          ],
          "end": [
            "goes soft",
            "very sour",
            "cooked rather than eaten raw"
          ]
        },
        "note": "Whole napa heads rather than shreds, held down by a stone and topped up with water, and cold enough that the ferment takes all winter instead of a month. Sauerkraut reached independently."
      },
      {
        "name": "Ogórki kiszone",
        "facets": {
          "region": [
            "Poland"
          ],
          "salt": [
            "submerged in brine",
            "pressed under a weight"
          ],
          "add": [
            "garlic",
            "dill",
            "a horseradish leaf"
          ],
          "keep": [
            "room temperature",
            "a few days",
            "then moved somewhere cold"
          ],
          "end": [
            "goes soft",
            "sour all the way through",
            "cloudy brine"
          ]
        },
        "note": "The horseradish leaf is not seasoning. Its tannins slow the enzymes that soften the cucumber — the one ingredient here whose job is texture. What it buys is weeks rather than crunch: the cucumber goes soft in the end, only later than it would have."
      },
      {
        "name": "Kimchi",
        "facets": {
          "region": [
            "Korea"
          ],
          "salt": [
            "submerged in brine",
            "rinsed after salting",
            "drained overnight"
          ],
          "add": [
            "gochugaru",
            "garlic",
            "ginger",
            "salted shrimp"
          ],
          "keep": [
            "cool cellar",
            "started at room temperature",
            "months"
          ],
          "end": [
            "goes soft",
            "sour and fizzy",
            "better after a month"
          ]
        },
        "note": "The only one salted twice over: brined to draw water out, rinsed so it is not inedible, then packed with a seasoning of chilli powder, garlic and salted shrimp that ferments alongside it."
      },
      {
        "name": "Dongchimi",
        "facets": {
          "region": [
            "Korea"
          ],
          "salt": [
            "submerged in brine",
            "a weak brine"
          ],
          "add": [
            "garlic",
            "ginger",
            "whole chillies",
            "asian pear"
          ],
          "keep": [
            "cold from the start",
            "buried in an onggi jar",
            "a month"
          ],
          "end": [
            "stays crunchy",
            "clean and fizzy",
            "the broth is the point"
          ]
        },
        "note": "Not kimchi minus the paste — it is older than chilli in Korea. The liquid is strained off for cold noodle broth."
      },
      {
        "name": "Pao cai",
        "facets": {
          "region": [
            "China",
            "Sichuan"
          ],
          "salt": [
            "submerged in brine",
            "never touched with an oily hand"
          ],
          "add": [
            "a starter",
            "brine from the last jar",
            "dried chilli",
            "sichuan peppercorn",
            "a splash of baijiu"
          ],
          "keep": [
            "room temperature",
            "a water-sealed jar",
            "three days"
          ],
          "end": [
            "stays crunchy",
            "barely sour",
            "eaten within the week"
          ]
        },
        "note": "The jar has a water moat round its lid: gas escapes, air never gets back in. The old brine is kept going for decades and inoculates each new batch."
      },
      {
        "name": "Zha cai",
        "facets": {
          "region": [
            "China",
            "Chongqing"
          ],
          "salt": [
            "dry-salted",
            "wilted first",
            "pressed three times"
          ],
          "add": [
            "chilli paste",
            "sichuan peppercorn"
          ],
          "keep": [
            "room temperature",
            "sealed in earthenware",
            "three to six months"
          ],
          "end": [
            "stays crunchy",
            "salty more than sour",
            "keeps a year"
          ]
        },
        "note": "The knobbed stem of a mustard plant, not a leaf, grown at Fuling on the Yangtze. It is hung to wilt before any salt goes near it, and pressing it three times is what leaves it crunchy after half a year in the jar."
      },
      {
        "name": "Nukazuke",
        "facets": {
          "region": [
            "Japan"
          ],
          "salt": [
            "dry-salted",
            "buried in a wet rice-bran bed"
          ],
          "add": [
            "a starter",
            "a bran bed kept alive for years",
            "kombu",
            "dried chilli"
          ],
          "keep": [
            "room temperature",
            "turned by hand every day",
            "overnight"
          ],
          "end": [
            "stays crunchy",
            "barely sour",
            "eaten the next morning"
          ]
        },
        "note": "The bed is the dish and the vegetable is a guest — cucumbers go in at night and come out at breakfast, and the nukadoko is fed and stirred forever."
      },
      {
        "name": "Dưa cải chua",
        "facets": {
          "region": [
            "Vietnam"
          ],
          "salt": [
            "submerged in brine",
            "wilted first"
          ],
          "add": [
            "a starter",
            "water from rinsing rice",
            "a spoon of sugar"
          ],
          "keep": [
            "warm kitchen",
            "two to three days"
          ],
          "end": [
            "stays crunchy",
            "sharply sour",
            "yellows as it goes"
          ]
        },
        "note": "Mustard greens, wilted a few hours so they bend into the jar. The rice water and the sugar are both there to get the bacteria moving before anything else does."
      },
      {
        "name": "Torshi left",
        "facets": {
          "region": [
            "Iraq",
            "Levant"
          ],
          "salt": [
            "submerged in brine"
          ],
          "add": [
            "garlic",
            "beetroot for colour"
          ],
          "keep": [
            "room temperature",
            "two weeks"
          ],
          "end": [
            "stays crunchy",
            "sour",
            "stained pink"
          ]
        },
        "note": "Turnip. The beetroot is one slice and it is there entirely for the colour. The Persian sense of torshi usually means vinegar instead — this is the salt-brine branch."
      },
      {
        "name": "Şalgam suyu",
        "facets": {
          "region": [
            "Turkey",
            "Adana"
          ],
          "salt": [
            "submerged in brine"
          ],
          "add": [
            "a starter",
            "a bulgur sourdough",
            "turnip for aroma",
            "chilli"
          ],
          "keep": [
            "room temperature",
            "two weeks"
          ],
          "end": [
            "you drink the liquid",
            "the black carrot does the fermenting",
            "a slice goes back in the glass"
          ]
        },
        "note": "The name says turnip, but the black carrot is what ferments and the turnip goes in beside it for aroma. The brine is served cold beside kebab, and a slice of the carrot goes into the glass as it is poured, often with garlic or chilli."
      },
      {
        "name": "Kanji",
        "facets": {
          "region": [
            "India",
            "Punjab"
          ],
          "salt": [
            "submerged in brine"
          ],
          "add": [
            "ground mustard seed",
            "black carrot",
            "chilli powder"
          ],
          "keep": [
            "in the sun",
            "four to six days"
          ],
          "end": [
            "you drink the liquid",
            "the carrot is eaten after"
          ]
        },
        "note": "Black carrot fermented into a sour drink, set out in the winter sun to keep the jar warm — the same answer Adana arrived at, except that nothing is added to start it. The mustard keeps the competition down and the carrots bring their own bacteria."
      },
      {
        "name": "Gajar gobhi shalgam achar",
        "facets": {
          "region": [
            "India",
            "Punjab"
          ],
          "salt": [
            "dry-salted",
            "wilted first",
            "blanched before drying"
          ],
          "add": [
            "ground mustard seed",
            "mustard oil",
            "jaggery",
            "turmeric"
          ],
          "keep": [
            "in the sun",
            "a jar on the roof",
            "two to three weeks"
          ],
          "end": [
            "goes soft",
            "keeps a year under oil"
          ]
        },
        "note": "The winter pickle: the vegetables are dipped in boiling water and dried in the sun before any salt goes near them. Oil on top does what a brine does elsewhere — seals the surface — and the jaggery gives the bacteria something to eat."
      },
      {
        "name": "Curtido",
        "facets": {
          "region": [
            "El Salvador"
          ],
          "salt": [
            "dry-salted",
            "scalded first"
          ],
          "add": [
            "oregano",
            "carrot",
            "onion"
          ],
          "keep": [
            "warm kitchen",
            "two to three days"
          ],
          "end": [
            "stays crunchy",
            "lightly sour",
            "piled on pupusas"
          ]
        },
        "note": "Three days, not three weeks, so it is a relish rather than a preserve. The scald is argued over — skip it and the ferment starts faster."
      },
      {
        "name": "Gundruk",
        "facets": {
          "region": [
            "Nepal"
          ],
          "salt": [
            "no salt at all",
            "crushed to bruise the leaves"
          ],
          "add": [
            "nothing at all"
          ],
          "keep": [
            "warm kitchen",
            "sealed in an earthen pot",
            "a week"
          ],
          "end": [
            "dried for storage",
            "sour when soaked back"
          ]
        },
        "note": "No salt anywhere in it. Bruising the leaves floods the pot with their own juice fast enough that nothing else gets a foothold — then it is sun-dried and keeps for a year."
      },
      {
        "name": "Gari",
        "facets": {
          "region": [
            "West Africa"
          ],
          "salt": [
            "no salt at all",
            "grated to a mash"
          ],
          "add": [
            "nothing at all"
          ],
          "keep": [
            "room temperature",
            "pressed in a sack",
            "three to five days"
          ],
          "end": [
            "dried for storage",
            "toasted to stop it",
            "keeps for months"
          ]
        },
        "note": "Cassava, and the ferment is not for flavour — it breaks down the cyanide that makes the raw root poisonous. Toasting on a hot pan ends it."
      }
    ],
    "notes": [
      {
        "title": "On salt",
        "body": "Salt ferments nothing. It pulls water out of the vegetable into a brine that lactobacillus tolerates and most spoilage organisms do not — it is a doorman, not a cook. Brining and dry-salting are two routes to the same brine: one you mix, the other the cabbage makes. Gundruk and gari dismiss the doorman entirely and rely on speed instead, and on shutting the air out by sealing the pot or pressing the mash dry."
      },
      {
        "title": "On where you stop",
        "body": "Crunch is pectin, and pectin is lost to warmth and time rather than to salt. The same jar of cucumbers is a crisp half-sour at three days on the counter and a soft full-sour at three weeks, with nothing added in between. The crunchy column is mostly cold, or quick, or both. The exceptions are zha cai and the turnip in torshi left, both dense stem-and-root rather than leaf, which is why they hold where a cabbage would collapse — which is neither: it is wilted and then pressed three times over until there is too little water left in it to soften."
      },
      {
        "title": "On depth",
        "body": "Nothing here sits under anything else. Kimchi is not dongchimi with chilli paste added — dongchimi is older than chilli in Korea, and both descend from the same habit of salting vegetables down for the winter. Sauerkraut and suan cai are one idea arrived at twice by people who never met. Siblings, all of them."
      }
    ],
    "sources": [
      {
        "label": "Fermented foods (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Fermentation_in_food_processing"
      },
      {
        "label": "Kimchi",
        "url": "https://en.wikipedia.org/wiki/Kimchi"
      },
      {
        "label": "Sauerkraut",
        "url": "https://en.wikipedia.org/wiki/Sauerkraut"
      },
      {
        "label": "Tsukemono",
        "url": "https://en.wikipedia.org/wiki/Tsukemono"
      },
      {
        "label": "Zha cai",
        "url": "https://en.wikipedia.org/wiki/Zha_cai"
      },
      {
        "label": "Gundruk",
        "url": "https://en.wikipedia.org/wiki/Gundruk"
      },
      {
        "label": "Şalgam (turnip water)",
        "url": "https://en.wikipedia.org/wiki/Turnip_water"
      },
      {
        "label": "Torshi",
        "url": "https://en.wikipedia.org/wiki/Torshi"
      },
      {
        "label": "Curtido",
        "url": "https://en.wikipedia.org/wiki/Curtido"
      },
      {
        "label": "Garri",
        "url": "https://en.wikipedia.org/wiki/Garri"
      }
    ],
    "yours": [
      "kimchi",
      "sauerkraut",
      "kraut",
      "pickle",
      "pickled",
      "ferment",
      "brine",
      "curtido",
      "achar",
      "tsukemono",
      "torshi"
    ]
  },
  {
    "slug": "flatbread",
    "name": "Flatbread",
    "standfirst": "Ground grain or pulse, water, and something hot to press it against. Wherever a crop was ground to flour and a hot surface was at hand, someone arrived at this, which is what makes the family so legible: change the leavening, change the grain, or change the surface, and you land in a different country without changing the idea.",
    "root": "Ground grain or pulse and water, flattened, cooked against direct heat",
    "facets": [
      {
        "id": "leaven",
        "label": "Leavening"
      },
      {
        "id": "grain",
        "label": "Grain"
      },
      {
        "id": "flatten",
        "label": "Flattened"
      },
      {
        "id": "cook",
        "label": "Cooked"
      },
      {
        "id": "region",
        "label": "Region"
      }
    ],
    "nestings": [
      {
        "label": "By leavening",
        "by": [
          "leaven",
          "cook",
          "grain"
        ]
      },
      {
        "label": "By heat",
        "by": [
          "cook",
          "leaven"
        ]
      },
      {
        "label": "By region",
        "by": [
          "region",
          "cook"
        ]
      }
    ],
    "dishes": [
      {
        "name": "Chapati",
        "facets": {
          "leaven": [
            "unleavened"
          ],
          "grain": [
            "wheat",
            "wholemeal atta"
          ],
          "flatten": [
            "rolled thin"
          ],
          "cook": [
            "griddle",
            "dry tawa"
          ],
          "region": [
            "South Asia"
          ]
        },
        "note": "Pressed at the edges on the tawa — or finished a second over the open flame, when it is called a phulka — the two skins separate and it balloons. That puff is steam. It is the only leavening the bread ever gets."
      },
      {
        "name": "Paratha",
        "parent": "Chapati",
        "facets": {
          "leaven": [
            "unleavened"
          ],
          "grain": [
            "wheat",
            "wholemeal atta"
          ],
          "flatten": [
            "rolled thin",
            "smeared with fat",
            "folded",
            "rolled again"
          ],
          "cook": [
            "griddle",
            "shallow-fried in ghee"
          ],
          "region": [
            "South Asia"
          ]
        },
        "note": "Chapati dough plus fat folded back into it — the one row here that is another row plus something. The ghee keeps the sheets from fusing, so the bread comes off the tawa in leaves rather than as one skin."
      },
      {
        "name": "Puri",
        "facets": {
          "leaven": [
            "unleavened"
          ],
          "grain": [
            "wheat",
            "wholemeal atta"
          ],
          "flatten": [
            "rolled thin",
            "kept small"
          ],
          "cook": [
            "deep-fried"
          ],
          "region": [
            "South Asia"
          ]
        },
        "note": "The same dough as a chapati, nothing added, sent to a different heat. Submerged in hot oil the outside sets before any steam can escape, so it inflates into a sphere in about four seconds."
      },
      {
        "name": "Naan",
        "facets": {
          "leaven": [
            "yeast"
          ],
          "grain": [
            "wheat",
            "white maida"
          ],
          "flatten": [
            "stretched by hand",
            "pulled to a teardrop"
          ],
          "cook": [
            "tandoor",
            "slapped on the wall"
          ],
          "region": [
            "South Asia"
          ]
        },
        "note": "Yoghurt in the dough softens it and sours it; yeast does the lifting. Slapped wet-side onto the clay it hangs there while it bakes, which is why one end is drawn long. The same bread, under the same name, runs west through Central Asia and Iran."
      },
      {
        "name": "Lavash",
        "facets": {
          "leaven": [
            "unleavened"
          ],
          "grain": [
            "wheat",
            "white flour"
          ],
          "flatten": [
            "rolled thin",
            "stretched over a cushion"
          ],
          "cook": [
            "tandoor",
            "slapped on the wall"
          ],
          "region": [
            "Caucasus",
            "Armenia"
          ]
        },
        "note": "The same clay wall as naan. Leavened lavash exists — Armenian bakers keep a sourdough starter called ttkhmor for it — but the thin keeping kind is made without: rolled thin enough that it dries to a cracker and lasts for months, then sprinkled with water to come back soft."
      },
      {
        "name": "Sangak",
        "facets": {
          "leaven": [
            "sourdough"
          ],
          "grain": [
            "wheat",
            "wholemeal"
          ],
          "flatten": [
            "stretched by hand",
            "spread on a long peel"
          ],
          "cook": [
            "oven",
            "on a bed of hot pebbles"
          ],
          "region": [
            "Iran"
          ]
        },
        "note": "Sang is pebble. The stones hold far more heat than a flat floor and dimple the underside as it bakes; you pick the strays out at the table."
      },
      {
        "name": "Pita",
        "facets": {
          "leaven": [
            "yeast"
          ],
          "grain": [
            "wheat",
            "white flour"
          ],
          "flatten": [
            "rolled thin",
            "rested before baking"
          ],
          "cook": [
            "oven",
            "very hot floor"
          ],
          "region": [
            "Eastern Mediterranean",
            "Levant"
          ]
        },
        "note": "The pocket is not an ingredient. A thin round hitting a very hot floor sets both faces before the steam between them can escape, and the bread blows itself apart into two layers."
      },
      {
        "name": "Matzo",
        "facets": {
          "leaven": [
            "unleavened",
            "no fermentation at all"
          ],
          "grain": [
            "wheat",
            "white flour"
          ],
          "flatten": [
            "rolled thin",
            "docked with holes"
          ],
          "cook": [
            "oven",
            "very hot floor"
          ],
          "region": [
            "Jewish diaspora"
          ]
        },
        "note": "The only bread here defined by a clock: eighteen minutes from water meeting flour to leaving the oven, before wild yeast can take hold. The docking holes are there to stop it doing what a pita does."
      },
      {
        "name": "Injera",
        "facets": {
          "leaven": [
            "fermented batter",
            "wild ersho starter"
          ],
          "grain": [
            "teff"
          ],
          "flatten": [
            "poured as batter",
            "swirled from the outside in"
          ],
          "cook": [
            "griddle",
            "one side only",
            "clay mitad",
            "lidded"
          ],
          "region": [
            "Horn of Africa"
          ]
        },
        "note": "Days of fermentation give both the sourness and the gas. The bubbles that break through the top are the eyes, and they are what the stew soaks into. In Ethiopia and Eritrea alike it is the plate as much as the bread."
      },
      {
        "name": "Dosa",
        "facets": {
          "leaven": [
            "fermented batter",
            "wild fermentation overnight"
          ],
          "grain": [
            "rice",
            "urad dal"
          ],
          "flatten": [
            "poured as batter",
            "spread in a spiral"
          ],
          "cook": [
            "griddle",
            "one side only",
            "oiled"
          ],
          "region": [
            "South Asia"
          ]
        },
        "note": "South India reached injera's solution independently: let wild fermentation do the leavening, then pour rather than roll. Rice and lentils ground together supply the protein that wheat would otherwise have brought."
      },
      {
        "name": "Corn tortilla",
        "facets": {
          "leaven": [
            "unleavened"
          ],
          "grain": [
            "maize",
            "nixtamalised"
          ],
          "flatten": [
            "pressed",
            "between two plates"
          ],
          "cook": [
            "griddle",
            "dry comal",
            "turned three times"
          ],
          "region": [
            "Mexico"
          ]
        },
        "note": "Nixtamalisation — simmering the maize in lime water — is the only alkaline treatment in this table. It lets the dough cohere without gluten and frees the niacin that would otherwise be locked away. Mesoamerica has been doing it for three thousand years."
      },
      {
        "name": "Flour tortilla",
        "facets": {
          "leaven": [
            "chemical",
            "a little baking powder"
          ],
          "grain": [
            "wheat",
            "white flour"
          ],
          "flatten": [
            "rolled thin",
            "rested"
          ],
          "cook": [
            "griddle",
            "dry comal"
          ],
          "region": [
            "Mexico"
          ]
        },
        "note": "Where wheat grew better than maize — the north of the country, and the US Southwest beyond it — the same comal took a different dough. Lard is what lets it fold instead of crack, and it is the only bread here leavened out of a tin."
      },
      {
        "name": "Arepa",
        "facets": {
          "leaven": [
            "unleavened"
          ],
          "grain": [
            "maize",
            "precooked masarepa"
          ],
          "flatten": [
            "patted by hand",
            "kept thick"
          ],
          "cook": [
            "griddle",
            "budare",
            "finished in the oven"
          ],
          "region": [
            "Venezuela",
            "Colombia"
          ]
        },
        "note": "Alone in this table it is made thick on purpose, so it can be split and filled — a flatbread that behaves like a roll. Precooked maize flour turned a day of pounding into five minutes and is why the habit survived."
      },
      {
        "name": "Laobing",
        "facets": {
          "leaven": [
            "unleavened"
          ],
          "grain": [
            "wheat",
            "white flour"
          ],
          "flatten": [
            "rolled thin",
            "smeared with fat",
            "coiled",
            "flattened again"
          ],
          "cook": [
            "griddle",
            "shallow-fried in oil"
          ],
          "region": [
            "Northern China"
          ]
        },
        "note": "Oil brushed between the turns keeps the coil from welding into one mass, so a single sheet fries up as dozens. Chewy centre, blistered crust, the size of a pizza."
      },
      {
        "name": "Msemen",
        "facets": {
          "leaven": [
            "unleavened"
          ],
          "grain": [
            "wheat",
            "fine semolina"
          ],
          "flatten": [
            "stretched by hand",
            "smeared with fat",
            "folded into a square"
          ],
          "cook": [
            "griddle",
            "shallow-fried in oil"
          ],
          "region": [
            "Maghreb",
            "Morocco"
          ]
        },
        "note": "Pulled translucent on an oiled surface, then folded in thirds and in thirds again — nine layers with fat between every one. Paratha and laobing do the same thing, and a belt of layered breads called katlama runs most of the way between them: katmer in Turkey, qatlama in Azerbaijan and Uzbekistan, kattama in Kyrgyzstan, katlama again in Kashmir."
      },
      {
        "name": "Socca",
        "facets": {
          "leaven": [
            "unleavened",
            "rested but not fermented"
          ],
          "grain": [
            "chickpea"
          ],
          "flatten": [
            "poured as batter",
            "left to level itself"
          ],
          "cook": [
            "oven",
            "wood-fired",
            "in a copper pan"
          ],
          "region": [
            "Nice",
            "Liguria"
          ]
        },
        "note": "No grain in it at all — chickpea flour, water, olive oil. The batter is thin enough to find its own level in the pan, so nobody rolls or spreads it. Called farinata a few miles east along the same coast, and sold by the wedge off a barrow in both."
      }
    ],
    "notes": [
      {
        "title": "On leavening",
        "body": "Unleavened is a decision, not an absence. There are five answers in this table and each carries a cost: nothing at all is instant and keeps badly; yeast buys lift and softness for an hour's waiting; sourdough buys flavour and keeping for a day's; a fermented batter buys both plus a sourness the others cannot reach, and needs a starter kept alive; a tin of baking powder buys tenderness with no time at all, which is why it is the newest entry here."
      },
      {
        "title": "On the puff",
        "body": "Chapati, pita and puri look unrelated and share one mechanism. Roll a dough thin, hit it with heat fast enough that both surfaces set before the water inside has finished turning to steam, and the trapped steam splits it into two skins. Griddle, oven floor and deep fat are three ways of buying that speed. Matzo is docked with holes precisely to prevent it, and injera is poured too wet and cooked too gently for it ever to happen."
      },
      {
        "title": "On the fire",
        "body": "The surface is the sharpest fork in the family. A griddle cooks one face at a time and asks for a thin bread you can flip. A tandoor cooks by radiation and contact at once at around 400C, so the bread is stuck to the wall and off again in ninety seconds — you cannot make naan properly in a domestic oven, and that is why. An oven surrounds the bread, which is what lets sangak be thick and pita puff evenly. Hot fat is an oven that touches every surface at the same instant."
      },
      {
        "title": "On the grain",
        "body": "Wheat dominates the table because wheat has gluten and gluten lets you roll a sheet thin without it tearing. Everywhere wheat did not grow, someone found another route to the same flat bread: nixtamalise maize and it coheres without gluten; ferment teff or rice and lentils and you can pour what you could never have rolled; grind chickpeas and skip the grain question entirely. The grain is the constraint, and the technique is the answer to it."
      }
    ],
    "sources": [
      {
        "label": "Flatbread (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Flatbread"
      },
      {
        "label": "Injera",
        "url": "https://en.wikipedia.org/wiki/Injera"
      },
      {
        "label": "Nixtamalization",
        "url": "https://en.wikipedia.org/wiki/Nixtamalization"
      },
      {
        "label": "Sangak",
        "url": "https://en.wikipedia.org/wiki/Sangak"
      },
      {
        "label": "Lavash",
        "url": "https://en.wikipedia.org/wiki/Lavash"
      },
      {
        "label": "Laobing",
        "url": "https://en.wikipedia.org/wiki/Laobing"
      },
      {
        "label": "Katlama",
        "url": "https://en.wikipedia.org/wiki/Katlama"
      },
      {
        "label": "Arepa",
        "url": "https://en.wikipedia.org/wiki/Arepa"
      }
    ],
    "yours": [
      "flatbread",
      "roti",
      "chapati",
      "paratha",
      "naan",
      "tortilla",
      "pita",
      "puri",
      "dosa",
      "injera",
      "arepa",
      "lavash",
      "matzo",
      "socca",
      "farinata"
    ]
  },
  {
    "slug": "fresh-cheese",
    "name": "Fresh cheese",
    "standfirst": "Every one of these is milk that has been made to quit, and eaten before it has time to ripen. What separates them is what did the quitting — an acid, an enzyme, or heat applied to the whey another cheese threw away — and then four decisions about the curd: pressed or not, salted or not, stretched or not, and whether any of it will ever melt.",
    "root": "Milk · brought to the point where it curdles · the curd lifted out of the whey",
    "facets": [
      {
        "id": "set",
        "label": "Set with"
      },
      {
        "id": "curd",
        "label": "The curd"
      },
      {
        "id": "salt",
        "label": "Salt"
      },
      {
        "id": "heat",
        "label": "Under heat"
      },
      {
        "id": "region",
        "label": "Region"
      }
    ],
    "nestings": [
      {
        "label": "By what sets it",
        "by": [
          "set",
          "curd",
          "salt"
        ]
      },
      {
        "label": "By whether it melts",
        "by": [
          "heat",
          "curd",
          "set"
        ]
      },
      {
        "label": "By region",
        "by": [
          "region",
          "set"
        ]
      }
    ],
    "dishes": [
      {
        "name": "Paneer",
        "facets": {
          "region": [
            "South Asia",
            "north India and Pakistan"
          ],
          "set": [
            "a food acid",
            "lemon juice or vinegar",
            "milk held at a rolling boil"
          ],
          "curd": [
            "pressed under a weight",
            "tied up in muslin",
            "cut into cubes"
          ],
          "salt": [
            "none at all"
          ],
          "heat": [
            "holds its shape",
            "browns in the pan",
            "goes springy in a gravy"
          ]
        },
        "note": "Acid dropped into milk at a boil does two things at once — denatures the whey protein and strips the calcium out of the curd. Nothing is left that could ever flow, which is why paneer can be fried and simmered and still be cubes."
      },
      {
        "name": "Chhena",
        "facets": {
          "region": [
            "South Asia",
            "Bengal and Odisha"
          ],
          "set": [
            "a food acid",
            "lemon juice or whey kept from the last batch",
            "milk taken off the boil first"
          ],
          "curd": [
            "never pressed",
            "hung to drip for an hour",
            "kneaded smooth against the palm"
          ],
          "salt": [
            "none at all"
          ],
          "heat": [
            "holds its shape",
            "poached in sugar syrup",
            "cooks down into a fudge"
          ]
        },
        "note": "Paneer's twin stopped one step earlier. Nobody presses it and the milk never boils hard with the acid in it — so the curd stays soft enough to knead into a paste. The north gets cubes for gravy; Bengal gets rasgulla and sandesh."
      },
      {
        "name": "Ricotta",
        "facets": {
          "region": [
            "Italy"
          ],
          "set": [
            "whey reheated",
            "the whey another cheese threw away",
            "a splash of acid to bring it up"
          ],
          "curd": [
            "never pressed",
            "skimmed off the surface as it rises",
            "drained in a perforated basket"
          ],
          "salt": [
            "barely any"
          ],
          "heat": [
            "holds its shape",
            "sets firm when baked with egg",
            "grains rather than runs"
          ]
        },
        "note": "Not made from milk at all. Ricotta means recooked: the albumin that rennet leaves behind in the whey comes back at around 85°C as a second cheese from the same pot."
      },
      {
        "name": "Mizithra",
        "facets": {
          "region": [
            "Greece",
            "Crete and the islands"
          ],
          "set": [
            "whey reheated",
            "the whey left from the day's feta",
            "fresh milk stirred back in for richness"
          ],
          "curd": [
            "never pressed",
            "drained in a rush basket",
            "hung up to firm"
          ],
          "salt": [
            "barely any",
            "salted hard only if it is to be dried"
          ],
          "heat": [
            "holds its shape",
            "grated over hot pasta",
            "browns in butter"
          ]
        },
        "note": "Ricotta's sibling rather than its variation — the same whey trick reached independently, with milk added back. Left alone it is eaten within the week; salted and dried it turns into a grating cheese and stops being fresh."
      },
      {
        "name": "Queso fresco",
        "facets": {
          "region": [
            "Mexico"
          ],
          "set": [
            "rennet",
            "a little lime juice alongside it",
            "milk barely warmed"
          ],
          "curd": [
            "pressed lightly",
            "broken up by hand first",
            "shaped into a flat round"
          ],
          "salt": [
            "salted into the curd"
          ],
          "heat": [
            "holds its shape",
            "softens without running",
            "crumbles over anything hot"
          ]
        },
        "note": "The acid-set white round sold beside it is queso blanco. Set the same milk with rennet instead and you get a curd that takes salt right through and softens under heat rather than drying out."
      },
      {
        "name": "Queso Oaxaca",
        "facets": {
          "region": [
            "Mexico",
            "Oaxaca"
          ],
          "set": [
            "rennet",
            "the curd then left to sour to stretching point"
          ],
          "curd": [
            "stretched in hot water",
            "pulled out into one long ribbon",
            "wound into a ball like wool"
          ],
          "salt": [
            "brined briefly",
            "the stretching water salted too"
          ],
          "heat": [
            "melts and pulls",
            "strings when torn",
            "the inside of a quesadilla"
          ]
        },
        "note": "Mozzarella's method arrived with Spanish dairying and was finished differently: a single ribbon coiled into a ball, so the cheese is torn off in threads rather than sliced."
      },
      {
        "name": "Mozzarella",
        "facets": {
          "region": [
            "Italy",
            "Campania"
          ],
          "set": [
            "rennet",
            "the curd then left to sour to stretching point",
            "buffalo milk traditionally"
          ],
          "curd": [
            "stretched in hot water",
            "torn off in balls by hand"
          ],
          "salt": [
            "brined briefly",
            "then kept in its own whey"
          ],
          "heat": [
            "melts and pulls",
            "weeps water onto a pizza",
            "browns in blisters"
          ]
        },
        "note": "Mozzare means to cut off — the ball is torn from the hot rope by hand. It will only stretch inside a narrow window of acidity: a shade too sweet and it tears, a shade too sour and it dissolves into the water."
      },
      {
        "name": "Burrata",
        "parent": "Mozzarella",
        "facets": {
          "region": [
            "Italy",
            "Puglia"
          ],
          "set": [
            "rennet",
            "the curd then left to sour to stretching point",
            "cow milk"
          ],
          "curd": [
            "stretched in hot water",
            "shaped into a hollow pouch",
            "filled with curd shreds and cream"
          ],
          "salt": [
            "brined briefly",
            "salt in the cream as well"
          ],
          "heat": [
            "melts and pulls",
            "meant to be eaten cold",
            "the filling runs the moment it is cut"
          ]
        },
        "note": "Genuinely mozzarella plus something, which is why it sits underneath: a mozzarella skin tied around the offcuts of the day's stretching, soaked in cream. Invented in Andria to use up scraps."
      },
      {
        "name": "Halloumi",
        "facets": {
          "region": [
            "Cyprus"
          ],
          "set": [
            "rennet",
            "no starter culture at all",
            "sheep and goat milk"
          ],
          "curd": [
            "pressed under a weight",
            "then cooked in its own whey",
            "folded over dry mint"
          ],
          "salt": [
            "brined for keeps",
            "brined in the cooked whey",
            "mint in the brine"
          ],
          "heat": [
            "holds its shape",
            "grills to a brown crust",
            "squeaks against the teeth"
          ]
        },
        "note": "Leaving out the starter keeps the curd sweet and full of calcium; cooking it in whey sets the protein hard. Two moves aimed at one thing — a cheese you can lay directly on a fire."
      },
      {
        "name": "Feta",
        "facets": {
          "region": [
            "Greece"
          ],
          "set": [
            "rennet",
            "a starter culture first",
            "sheep milk with up to a third goat"
          ],
          "curd": [
            "never pressed",
            "drained in a mould under its own weight",
            "cut into blocks"
          ],
          "salt": [
            "brined for keeps",
            "dry-salted first",
            "then months in the barrel"
          ],
          "heat": [
            "holds its shape",
            "softens and browns under a grill",
            "never runs"
          ]
        },
        "note": "The one here that keeps going after it is made. Two months in brine is ripening rather than draining — feta walks off the fresh shelf while you watch it, and the salt is what carries it."
      },
      {
        "name": "Labneh",
        "facets": {
          "region": [
            "Levant"
          ],
          "set": [
            "its own souring",
            "yogurt cultures over a night",
            "no rennet and no acid poured in"
          ],
          "curd": [
            "never pressed",
            "hung in a cloth bag for a day",
            "rolled into balls once firm"
          ],
          "salt": [
            "salted into the curd",
            "before it goes into the bag"
          ],
          "heat": [
            "not cooked at all",
            "eaten cold under olive oil",
            "splits if you boil it"
          ]
        },
        "note": "The gentlest coagulation on the table — bacteria walking milk down to pH 4.6 over eight hours instead of acid dropped in at a boil. What drains away is whey; what stays is yogurt with the water gone."
      },
      {
        "name": "Cottage cheese",
        "facets": {
          "region": [
            "England · United States"
          ],
          "set": [
            "its own souring",
            "a starter culture overnight",
            "a trace of rennet to firm it"
          ],
          "curd": [
            "never pressed",
            "cut and then cooked gently",
            "washed in cold water"
          ],
          "salt": [
            "salted into the dressing"
          ],
          "heat": [
            "not cooked at all",
            "eaten cold from the tub",
            "goes grainy if it is heated"
          ]
        },
        "note": "The wash is the whole character. Rinsing the cooked curd takes the lactic acid off it and leaves grains that refuse to stick together — then cream is poured back in to hold them, and the salt goes into the cream rather than the curd."
      },
      {
        "name": "Queijo coalho",
        "facets": {
          "region": [
            "Brazil",
            "the Northeast"
          ],
          "set": [
            "rennet",
            "coalho is simply the word for rennet",
            "raw cow milk"
          ],
          "curd": [
            "pressed under a weight",
            "cut into bars"
          ],
          "salt": [
            "salted into the curd"
          ],
          "heat": [
            "holds its shape",
            "grilled on a stick over charcoal",
            "browns without running"
          ]
        },
        "note": "Halloumi's problem solved again on another continent by people who had never met it: a rennet curd firm enough to face a fire on a skewer. Sold off a bucket of coals on the beach."
      },
      {
        "name": "Leipäjuusto",
        "facets": {
          "region": [
            "Finland",
            "Ostrobothnia and Lapland"
          ],
          "set": [
            "rennet",
            "cow colostrum traditionally",
            "milk barely warmed"
          ],
          "curd": [
            "pressed under a weight",
            "shaped into a flat disc like a loaf",
            "browned in front of an open fire"
          ],
          "salt": [
            "barely any"
          ],
          "heat": [
            "holds its shape",
            "scorched into leopard spots",
            "squeaks against the teeth"
          ]
        },
        "note": "Bread cheese — pressed round like a loaf and stood by the fire until it blisters. The only one here that is browned before it ever reaches the table, and it is dunked in coffee."
      },
      {
        "name": "Wara",
        "facets": {
          "region": [
            "West Africa",
            "Nigeria and Benin"
          ],
          "set": [
            "plant sap",
            "leaves of the Sodom apple crushed into the pot",
            "milk brought to a simmer"
          ],
          "curd": [
            "pressed lightly",
            "shaped into flat discs",
            "boiled again in sorghum leaves to keep"
          ],
          "salt": [
            "none at all"
          ],
          "heat": [
            "holds its shape",
            "deep-fried in slabs",
            "crusts outside and stays soft within"
          ]
        },
        "note": "Calotropis procera sap carries proteases that cut casein in the same place rennet does — a rennet with no calf behind it. Fulani women have made this on the move for centuries; it is wagashi in Benin and warankasi in Nigeria."
      },
      {
        "name": "Rubing",
        "facets": {
          "region": [
            "China",
            "Yunnan"
          ],
          "set": [
            "a food acid",
            "juice pressed from the năiténg vine",
            "goat milk at a simmer"
          ],
          "curd": [
            "pressed under a weight",
            "wrapped in cloth",
            "cut into slabs"
          ],
          "salt": [
            "none at all"
          ],
          "heat": [
            "holds its shape",
            "fried in slabs until gold",
            "dusted with salt and chilli at the table"
          ]
        },
        "note": "China's one dairy corner, made by Bai and Sani households. A climbing vine stands in for the lemon nobody had to import, and the seasoning waits until the slab is out of the pan."
      }
    ],
    "notes": [
      {
        "title": "On the three ways to break milk",
        "body": "Acid does it by neutralising the charge that keeps casein micelles apart — they stop repelling each other and clump. Rennet does it by cutting one specific protein off the outside of the micelle, which has the same effect by a different route. Reheated whey is neither: the curd is already gone, and what sets is the whey protein left behind, which needs heat rather than a coagulant. The Sodom apple sap in wara is rennet by another name — a plant protease cutting casein at the same bond — and the năiténg vine in rubing is an acid nobody had to buy."
      },
      {
        "title": "On melting",
        "body": "Melting is not about acid versus rennet — it is about how much calcium is left holding the protein together. Acid at a boil strips the calcium out completely, so paneer and rubing can never flow. Rennet with no starter leaves too much of it in, so halloumi and queijo coalho grill instead of running. Mozzarella lives in the gap: rennet first, then souring to about pH 5.2, which removes just enough calcium for the network to slide when it is hot and no more. That is the whole reason it is stretched at all."
      },
      {
        "title": "On pressing",
        "body": "Pressing is not about firmness so much as about what the cheese will be asked to do. Everything pressed under a weight is going to meet direct heat — a pan, a grill, a fire, a skewer. Everything left to drain under its own weight is going to be spread or crumbled or sweetened. Paneer and chhena are the same curd and the press is the only fork between them."
      },
      {
        "title": "On depth",
        "body": "Only burrata sits underneath another dish, because it genuinely is mozzarella plus a filling. Everything else is one move from milk and belongs at the same level. Queso Oaxaca is not a Mexican mozzarella and mizithra is not a Greek ricotta — they are separate answers to the same question, and hanging one under the other would make the picture tidier and the claim false."
      }
    ],
    "sources": [
      {
        "label": "Fresh cheese (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Fresh_cheese"
      },
      {
        "label": "Paneer",
        "url": "https://en.wikipedia.org/wiki/Paneer"
      },
      {
        "label": "Chhena",
        "url": "https://en.wikipedia.org/wiki/Chhena"
      },
      {
        "label": "Ricotta",
        "url": "https://en.wikipedia.org/wiki/Ricotta"
      },
      {
        "label": "Mizithra",
        "url": "https://en.wikipedia.org/wiki/Mizithra"
      },
      {
        "label": "Queso fresco",
        "url": "https://en.wikipedia.org/wiki/Queso_blanco"
      },
      {
        "label": "Oaxaca cheese",
        "url": "https://en.wikipedia.org/wiki/Oaxaca_cheese"
      },
      {
        "label": "Mozzarella",
        "url": "https://en.wikipedia.org/wiki/Mozzarella"
      },
      {
        "label": "Burrata",
        "url": "https://en.wikipedia.org/wiki/Burrata"
      },
      {
        "label": "Halloumi",
        "url": "https://en.wikipedia.org/wiki/Halloumi"
      },
      {
        "label": "Feta",
        "url": "https://en.wikipedia.org/wiki/Feta"
      },
      {
        "label": "Labneh",
        "url": "https://en.wikipedia.org/wiki/Strained_yogurt"
      },
      {
        "label": "Cottage cheese",
        "url": "https://en.wikipedia.org/wiki/Cottage_cheese"
      },
      {
        "label": "Queijo coalho",
        "url": "https://en.wikipedia.org/wiki/Coalho"
      },
      {
        "label": "Bread cheese (leipäjuusto)",
        "url": "https://en.wikipedia.org/wiki/Bread_cheese"
      },
      {
        "label": "Warankasi / wagashi",
        "url": "https://en.wikipedia.org/wiki/Warankasi"
      },
      {
        "label": "Rubing",
        "url": "https://en.wikipedia.org/wiki/Rubing"
      }
    ],
    "yours": [
      "paneer",
      "ricotta",
      "mozzarella",
      "burrata",
      "halloumi",
      "feta",
      "labneh",
      "queso fresco",
      "cottage cheese",
      "chhena",
      "curd cheese",
      "fresh cheese",
      "quesillo",
      "coalho"
    ]
  },
  {
    "slug": "fried-chicken",
    "name": "Fried chicken",
    "standfirst": "Chicken meets hot fat in every one of these. What separates them is what went into the meat beforehand, what went onto the outside, how it meets the fat — once, twice, under pressure, or shallow in a pan — and what happens in the ten seconds after it comes out.",
    "root": "Chicken, in pieces or pounded flat · salt · hot fat",
    "facets": [
      {
        "id": "prep",
        "label": "Before the fryer"
      },
      {
        "id": "coat",
        "label": "Coating"
      },
      {
        "id": "fry",
        "label": "The fry"
      },
      {
        "id": "after",
        "label": "After the fry"
      },
      {
        "id": "region",
        "label": "Region"
      }
    ],
    "nestings": [
      {
        "label": "By coating",
        "by": [
          "coat",
          "fry",
          "after"
        ]
      },
      {
        "label": "By what happens after",
        "by": [
          "after",
          "coat"
        ]
      },
      {
        "label": "By region",
        "by": [
          "region",
          "coat"
        ]
      }
    ],
    "dishes": [
      {
        "name": "Southern fried chicken",
        "facets": {
          "prep": [
            "brined",
            "buttermilk overnight"
          ],
          "coat": [
            "wheat flour",
            "seasoned with black pepper"
          ],
          "fry": [
            "fried once",
            "in a skillet of lard"
          ],
          "after": [
            "nothing after the fry"
          ],
          "region": [
            "American South"
          ]
        },
        "note": "The brine is the argument: salt and acid work into the meat overnight, so the flour has something already seasoned to cling to. Every other dish on this table is one substitution away from it."
      },
      {
        "name": "Nashville hot chicken",
        "parent": "Southern fried chicken",
        "facets": {
          "prep": [
            "brined",
            "buttermilk overnight"
          ],
          "coat": [
            "wheat flour",
            "seasoned with black pepper",
            "seasoned with cayenne"
          ],
          "fry": [
            "fried once",
            "in a skillet of lard"
          ],
          "after": [
            "brushed with a paste",
            "cayenne loosened in frying fat",
            "laid on white bread",
            "topped with pickle chips"
          ],
          "region": [
            "American South"
          ]
        },
        "note": "Genuinely Southern fried chicken plus a step, which is why it sits a level down. The paste goes on after the crust has set, so the heat stays on the outside and the bread underneath is there to take what runs off."
      },
      {
        "name": "Broasted chicken",
        "facets": {
          "prep": [
            "marinated",
            "in seasoned brine"
          ],
          "coat": [
            "wheat flour",
            "seasoned with paprika"
          ],
          "fry": [
            "fried under pressure"
          ],
          "after": [
            "nothing after the fry"
          ],
          "region": [
            "Wisconsin"
          ]
        },
        "note": "The same wheat-flour dredge as Southern, paprika in place of the pepper, in a sealed fryer. Pressure raises the boiling point of the moisture inside the bird so it cooks through before the crust darkens — a machine's answer to a timing problem cooks had solved with smaller pieces."
      },
      {
        "name": "Buffalo wings",
        "facets": {
          "prep": [
            "left plain"
          ],
          "coat": [
            "no coating"
          ],
          "fry": [
            "fried once"
          ],
          "after": [
            "tossed in a sauce",
            "cayenne hot sauce",
            "melted butter"
          ],
          "region": [
            "Buffalo"
          ]
        },
        "note": "Nothing done to the meat beforehand and nothing between skin and fat. The entire dish is the last column, which is what makes it the cleanest test of that column."
      },
      {
        "name": "Karaage",
        "facets": {
          "prep": [
            "marinated",
            "soy and sake",
            "ginger and garlic"
          ],
          "coat": [
            "starch",
            "potato starch"
          ],
          "fry": [
            "fried twice",
            "low then hot"
          ],
          "after": [
            "finished at the table",
            "a wedge of lemon"
          ],
          "region": [
            "Japan"
          ]
        },
        "note": "Starch instead of flour gives a thin shell that shatters rather than a craggy one that holds. The second fry runs hotter and drives off the moisture the first one pulled to the surface."
      },
      {
        "name": "Toriten",
        "facets": {
          "prep": [
            "marinated",
            "soy and sake",
            "ginger and garlic"
          ],
          "coat": [
            "wet batter",
            "tempura batter",
            "kept ice cold"
          ],
          "fry": [
            "fried once"
          ],
          "after": [
            "finished at the table",
            "ponzu",
            "karashi mustard"
          ],
          "region": [
            "Japan"
          ]
        },
        "note": "Japan's other answer, this one from Oita, and the clearest proof that the coating is a real branch: the marinade is karaage's, chip for chip. A cold batter puffs and stays pale where the same meat in starch would have shattered."
      },
      {
        "name": "Chicken katsu",
        "facets": {
          "prep": [
            "pounded flat"
          ],
          "coat": [
            "breadcrumb",
            "through flour and egg first",
            "panko"
          ],
          "fry": [
            "fried once",
            "deep"
          ],
          "after": [
            "finished at the table",
            "tonkatsu sauce"
          ],
          "region": [
            "Japan"
          ]
        },
        "note": "Panko is torn from crustless bread rather than ground, so the crumbs are shards and the crust dries open instead of packing tight. Flour then egg then crumb is the ladder every breaded cutlet here climbs but one — the milanesa goes straight from egg to crumb."
      },
      {
        "name": "Yangnyeom chicken",
        "facets": {
          "prep": [
            "seasoned dry",
            "salt and ginger"
          ],
          "coat": [
            "starch",
            "potato starch"
          ],
          "fry": [
            "fried twice",
            "rested between"
          ],
          "after": [
            "tossed in a sauce",
            "gochujang",
            "sugar and garlic"
          ],
          "region": [
            "Korea"
          ]
        },
        "note": "The double fry exists because of the sauce. A single-fried crust still holds water and goes soft the moment it is glazed; the rest between fries lets steam escape before the second one seals it."
      },
      {
        "name": "Dakgangjeong",
        "facets": {
          "prep": [
            "seasoned dry",
            "salt and ginger"
          ],
          "coat": [
            "starch",
            "potato starch"
          ],
          "fry": [
            "fried twice",
            "rested between"
          ],
          "after": [
            "tossed in a sauce",
            "soy and garlic",
            "syrup reduced to a hard glaze"
          ],
          "region": [
            "Korea"
          ]
        },
        "note": "Identical to yangnyeom until the pan of sauce, which here is boiled down until it sets like candy rather than staying wet. That single difference is why these are still crisp cold and yangnyeom is not."
      },
      {
        "name": "Chicken 65",
        "facets": {
          "prep": [
            "marinated",
            "yogurt",
            "chilli and ginger-garlic"
          ],
          "coat": [
            "wet batter",
            "cornflour and egg"
          ],
          "fry": [
            "fried once"
          ],
          "after": [
            "scattered over",
            "curry leaves crackled in oil",
            "green chilli"
          ],
          "region": [
            "India"
          ]
        },
        "note": "Attributed to the Buhari Hotel in Madras and dated to 1965 by most tellings. The yogurt is doing brine's job — salt and acid into the meat — but thick enough to stay put without a bowl."
      },
      {
        "name": "Chicken pakora",
        "facets": {
          "prep": [
            "marinated",
            "lemon juice",
            "chilli and ginger-garlic"
          ],
          "coat": [
            "wet batter",
            "gram flour",
            "carom seed"
          ],
          "fry": [
            "fried once"
          ],
          "after": [
            "scattered over",
            "chaat masala"
          ],
          "region": [
            "India"
          ]
        },
        "note": "Gram flour binds without egg and fries darker and nuttier than wheat. It is the Punjabi batter that already carries onion and potato, which is the point — the chicken is a passenger in an established coating."
      },
      {
        "name": "Yánsūjī",
        "facets": {
          "prep": [
            "marinated",
            "soy and rice wine",
            "five-spice"
          ],
          "coat": [
            "starch",
            "sweet potato starch"
          ],
          "fry": [
            "fried once"
          ],
          "after": [
            "scattered over",
            "basil leaves fried crisp",
            "white pepper salt"
          ],
          "region": [
            "Taiwan"
          ]
        },
        "note": "Salt-crisp chicken, sold everywhere outside Taiwan as popcorn chicken. Sweet potato starch is coarser than potato starch and fries into visible nubs rather than a smooth shell — that texture is what the night markets are actually selling."
      },
      {
        "name": "Chicken schnitzel",
        "facets": {
          "prep": [
            "pounded flat"
          ],
          "coat": [
            "breadcrumb",
            "through flour and egg first",
            "fine dry crumb"
          ],
          "fry": [
            "fried shallow in a pan",
            "in clarified butter",
            "the pan swirled so the crust lifts"
          ],
          "after": [
            "finished at the table",
            "a wedge of lemon"
          ],
          "region": [
            "Austria"
          ]
        },
        "note": "Wiener Schnitzel is veal by law, so the chicken version is a Hühnerschnitzel — and in Israel, where it arrived with Central European Jewish immigrants and stayed, simply schnitzel, as often turkey as chicken. Swirling hot fat over the top floats the crust off the meat instead of pressing it on."
      },
      {
        "name": "Milanesa de pollo",
        "facets": {
          "prep": [
            "marinated",
            "beaten egg",
            "garlic and parsley"
          ],
          "coat": [
            "breadcrumb",
            "fine dry crumb"
          ],
          "fry": [
            "fried shallow in a pan",
            "in oil"
          ],
          "after": [
            "finished at the table",
            "a wedge of lemon"
          ],
          "region": [
            "Argentina"
          ]
        },
        "note": "The cutlet sits in beaten egg with garlic and parsley for hours before it is crumbed, so the seasoning lives in the wet layer rather than the dry one and there is no flour step at all. Not a schnitzel variant — the milanesa came from the cotoletta alla milanese with Italian immigrants, while Vienna's Milanese origin is a story Vienna tells rather than a documented descent. Neither descends from the other."
      },
      {
        "name": "Ayam goreng Kalasan",
        "facets": {
          "prep": [
            "simmered first",
            "in coconut water",
            "with galangal and coriander seed"
          ],
          "coat": [
            "no coating"
          ],
          "fry": [
            "fried once"
          ],
          "after": [
            "scattered over",
            "crisp granules fried from the braising liquid"
          ],
          "region": [
            "Java"
          ]
        },
        "note": "The chicken is fully cooked before it meets the fryer, so the fry is only for colour and skin. The spiced braising liquid is not thrown out either — flour goes into it and it is fried again into kremes and showered over the top."
      },
      {
        "name": "Chicharrón de pollo",
        "facets": {
          "prep": [
            "marinated",
            "sour orange and lime",
            "oregano and garlic"
          ],
          "coat": [
            "wheat flour",
            "cut with cornstarch"
          ],
          "fry": [
            "fried once",
            "cut small so it fries fast"
          ],
          "after": [
            "finished at the table",
            "a squeeze of lime"
          ],
          "region": [
            "Dominican Republic"
          ]
        },
        "note": "Cut to bite size before it is dredged, which raises the ratio of crust to meat and shortens the fry — the same reasoning karaage and yánsūjī arrive at from the other side of the world. Cornstarch in the flour is what makes it shatter rather than crunch."
      }
    ],
    "notes": [
      {
        "title": "On the coating",
        "body": "Four answers, and they are not interchangeable. Wheat flour builds a thick craggy shell that holds sauce and gravy. Pure starch — potato in Japan and Korea, sweet potato in Taiwan — makes almost no gluten and dries into a thin glassy layer that shatters. A wet batter puffs, because the water in it turns to steam and leaves the coating hollow. Breadcrumb is the only one that is already dry and already cooked, so it browns before the meat is done and therefore belongs on something pounded thin. Two rows decline the question altogether and go into the fat bare — Buffalo wings because the sauce is the dish, ayam goreng Kalasan because the chicken is already cooked. Pick the coating and you have picked most of the dish."
      },
      {
        "title": "On frying twice",
        "body": "The second fry is not for browning. The first drives water out of the meat and up into the coating, where it would soften the crust as it cooled; a rest lets that steam leave and a hotter second fry sets what remains. So every dish here that meets a wet sauce after the fryer either goes in twice — yangnyeom and dakgangjeong are engineered to survive a glaze — or has no coating to lose, which is how Buffalo wings get away with a single fry. The converse does not hold: karaage fries twice for its own crust and goes out with a lemon wedge."
      },
      {
        "title": "On depth",
        "body": "Only Nashville hot chicken sits below another dish, because it genuinely is Southern fried chicken plus a paste applied afterwards. Everything else here is a sibling. Milanesa is not a schnitzel with garlic in it, karaage is not katsu without the crumb, and dakgangjeong and yangnyeom are two finishes on one fry rather than one descending from the other. Dishes from different traditions that solve the same problem belong at the same depth."
      },
      {
        "title": "What is not here",
        "body": "Pollo a la brasa is excluded: it is spit-roasted over charcoal, marinated but never fried, and it sits in this company only because it is also a whole seasoned chicken. Chicken-fried steak is beef. Roast and grilled birds with fried-chicken seasoning — jerk, tandoori, inasal — are a different family with a different first decision."
      }
    ],
    "sources": [
      {
        "label": "Fried chicken (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Fried_chicken"
      },
      {
        "label": "Hot chicken",
        "url": "https://en.wikipedia.org/wiki/Hot_chicken"
      },
      {
        "label": "Broaster Company",
        "url": "https://en.wikipedia.org/wiki/Broaster_Company"
      },
      {
        "label": "Karaage",
        "url": "https://en.wikipedia.org/wiki/Karaage"
      },
      {
        "label": "Toriten",
        "url": "https://en.wikipedia.org/wiki/Toriten"
      },
      {
        "label": "Korean fried chicken",
        "url": "https://en.wikipedia.org/wiki/Korean_fried_chicken"
      },
      {
        "label": "Chicken 65",
        "url": "https://en.wikipedia.org/wiki/Chicken_65"
      },
      {
        "label": "Taiwanese fried chicken",
        "url": "https://en.wikipedia.org/wiki/Taiwanese_popcorn_chicken"
      },
      {
        "label": "Ayam goreng Kalasan",
        "url": "https://en.wikipedia.org/wiki/Ayam_goreng_kalasan"
      },
      {
        "label": "Milanesa",
        "url": "https://en.wikipedia.org/wiki/Milanesa"
      },
      {
        "label": "Buffalo wing",
        "url": "https://en.wikipedia.org/wiki/Buffalo_wing"
      },
      {
        "label": "Tonkatsu",
        "url": "https://en.wikipedia.org/wiki/Tonkatsu"
      },
      {
        "label": "Schnitzel",
        "url": "https://en.wikipedia.org/wiki/Schnitzel"
      },
      {
        "label": "Pakora",
        "url": "https://en.wikipedia.org/wiki/Pakora"
      },
      {
        "label": "Chicharrón",
        "url": "https://en.wikipedia.org/wiki/Chicharr%C3%B3n"
      }
    ],
    "yours": [
      "fried chicken",
      "hot chicken",
      "buffalo wings",
      "karaage",
      "katsu",
      "korean fried chicken",
      "chicken 65",
      "pakora",
      "popcorn chicken",
      "schnitzel",
      "milanesa",
      "ayam goreng",
      "toriten",
      "broasted",
      "yangnyeom",
      "dakgangjeong",
      "chicharrón de pollo"
    ]
  },
  {
    "slug": "frozen-dessert",
    "name": "Frozen dessert",
    "standfirst": "All of these are a liquid taken below freezing — sweetened before the cold in most of them, after it in the shaved-ice ones. What separates them is whether there is dairy in it, whether an egg was cooked into it first, whether it moves while it freezes — and how much air ends up trapped inside.",
    "root": "A liquid taken below freezing · sweetened before or after",
    "facets": [
      {
        "id": "base",
        "label": "Base"
      },
      {
        "id": "body",
        "label": "Body from"
      },
      {
        "id": "freeze",
        "label": "Frozen"
      },
      {
        "id": "air",
        "label": "Air"
      },
      {
        "id": "region",
        "label": "Region"
      }
    ],
    "nestings": [
      {
        "label": "By how it freezes",
        "by": [
          "freeze",
          "base",
          "body"
        ]
      },
      {
        "label": "By what is in it",
        "by": [
          "base",
          "body",
          "air"
        ]
      },
      {
        "label": "By region",
        "by": [
          "region",
          "freeze"
        ]
      }
    ],
    "dishes": [
      {
        "name": "Ice cream (Philadelphia style)",
        "facets": {
          "base": [
            "cream base"
          ],
          "body": [
            "the fat itself"
          ],
          "freeze": [
            "churned while freezing"
          ],
          "air": [
            "a lot beaten in"
          ],
          "region": [
            "United States"
          ]
        },
        "note": "The uncooked one — cream, sugar and flavour go into the machine as they are. Everything with a custard below it has added a step before the cold."
      },
      {
        "name": "French ice cream",
        "facets": {
          "base": [
            "cream base"
          ],
          "body": [
            "egg yolk custard"
          ],
          "freeze": [
            "churned while freezing"
          ],
          "air": [
            "a lot beaten in"
          ],
          "region": [
            "France"
          ]
        },
        "note": "Crème anglaise, chilled and then churned. One column apart from Philadelphia style and a different dessert in the mouth: yolk fat coats the tongue where cream fat only fills it."
      },
      {
        "name": "Frozen custard",
        "facets": {
          "base": [
            "cream base"
          ],
          "body": [
            "egg yolk custard"
          ],
          "freeze": [
            "churned while freezing",
            "drawn straight from the machine"
          ],
          "air": [
            "almost none"
          ],
          "region": [
            "Midwestern United States"
          ]
        },
        "note": "The same custard as French ice cream with the air left out and the hardening step skipped. American law does not separate the two: 21 CFR 135.110 says anything at 1.4 percent egg yolk solids or more may be called frozen custard or french ice cream, so the fork drawn here is a kitchen one — overrun and serving temperature — not a legal one. The stand was a Coney Island invention of 1919 and only became a Wisconsin institution afterwards."
      },
      {
        "name": "Soft serve",
        "facets": {
          "base": [
            "milk base"
          ],
          "body": [
            "the fat itself",
            "stabiliser"
          ],
          "freeze": [
            "churned while freezing",
            "drawn straight from the machine"
          ],
          "air": [
            "a lot beaten in"
          ],
          "region": [
            "United States"
          ]
        },
        "note": "Sits beside frozen custard in the same machine and makes the opposite choice: less fat and much more air. Served at about −4°C rather than −18°C, which is why it curls."
      },
      {
        "name": "Gelato (crema)",
        "facets": {
          "base": [
            "milk base"
          ],
          "body": [
            "egg yolk custard"
          ],
          "freeze": [
            "churned while freezing",
            "held warmer than ice cream"
          ],
          "air": [
            "a little beaten in"
          ],
          "region": [
            "Italy"
          ]
        },
        "note": "Less fat than ice cream and much less air, served warm enough to be soft. Less fat means less coating on the tongue, so the flavour arrives faster and leaves sooner. The yolks are the northern convention, not the whole country — see the Sicilian row."
      },
      {
        "name": "Gelato (Sicilian)",
        "facets": {
          "base": [
            "milk base"
          ],
          "body": [
            "cornstarch"
          ],
          "freeze": [
            "churned while freezing",
            "held warmer than ice cream"
          ],
          "air": [
            "a little beaten in"
          ],
          "region": [
            "Sicily"
          ]
        },
        "note": "Body from starch cooked into the milk rather than from yolks, which is the older Sicilian way and lighter in a Sicilian summer. Nothing coats the tongue, so a pistachio or a lemon tastes of itself rather than of custard."
      },
      {
        "name": "Semifreddo",
        "facets": {
          "base": [
            "cream base"
          ],
          "body": [
            "egg yolk custard",
            "Italian meringue"
          ],
          "freeze": [
            "left still to freeze"
          ],
          "air": [
            "folded in before freezing"
          ],
          "region": [
            "Italy"
          ]
        },
        "note": "The air goes in before the cold instead of during it. Whipped cream and meringue hold it there, so no machine is needed and it never freezes hard."
      },
      {
        "name": "Kulfi",
        "facets": {
          "base": [
            "milk base",
            "boiled down by half"
          ],
          "body": [
            "milk solids"
          ],
          "freeze": [
            "left still to freeze",
            "set in sealed moulds"
          ],
          "air": [
            "none"
          ],
          "region": [
            "North India"
          ]
        },
        "note": "An hour of boiling before anything gets cold. There is too little free water left for crystals to grow, so stillness costs nothing — and the long heat leaves it tasting cooked."
      },
      {
        "name": "Dondurma",
        "facets": {
          "base": [
            "milk base",
            "goat milk"
          ],
          "body": [
            "salep (orchid tuber)",
            "mastic gum"
          ],
          "freeze": [
            "churned while freezing",
            "pounded with a paddle"
          ],
          "air": [
            "almost none"
          ],
          "region": [
            "Turkey"
          ]
        },
        "note": "Maraş dondurma. Flour milled from wild orchid tubers and resin from the mastic tree make it elastic enough to cut with a knife: it is sold on a stick, sliced rather than scooped, and eaten with a fork. The vendor's long-handled paddles are what keep it workable, worked constantly in a chilled churn."
      },
      {
        "name": "Frozen yogurt",
        "facets": {
          "base": [
            "milk base",
            "soured with live culture"
          ],
          "body": [
            "stabiliser"
          ],
          "freeze": [
            "churned while freezing"
          ],
          "air": [
            "a lot beaten in"
          ],
          "region": [
            "United States"
          ]
        },
        "note": "The tang is acid from the culture, not anything the freezing did. Strip the fat out and the sourness has nothing to hide behind, which is the whole flavour."
      },
      {
        "name": "Sorbet",
        "facets": {
          "base": [
            "fruit purée",
            "sugar syrup"
          ],
          "body": [
            "nothing added"
          ],
          "freeze": [
            "churned while freezing"
          ],
          "air": [
            "a little beaten in"
          ],
          "region": [
            "France"
          ]
        },
        "note": "No dairy at all, so the sugar is doing structural work as well as sweetening — too little and it sets like a rock, too much and it never sets."
      },
      {
        "name": "Sherbet",
        "parent": "Sorbet",
        "facets": {
          "base": [
            "fruit purée",
            "sugar syrup",
            "a little milk"
          ],
          "body": [
            "nothing added"
          ],
          "freeze": [
            "churned while freezing"
          ],
          "air": [
            "a little beaten in"
          ],
          "region": [
            "United States"
          ]
        },
        "note": "Sorbet with 1 to 2 percent milkfat stirred in — genuinely sorbet plus one thing. The dairy is there to blunt the ice crystals, not to taste of cream."
      },
      {
        "name": "Granita",
        "facets": {
          "base": [
            "fruit purée",
            "sugar syrup"
          ],
          "body": [
            "nothing added"
          ],
          "freeze": [
            "left still to freeze",
            "raked with a fork"
          ],
          "air": [
            "none"
          ],
          "region": [
            "Sicily"
          ]
        },
        "note": "The same syrup as sorbet, left alone and broken up by hand every half hour. Crystals are the point rather than the failure — though Palermo and Messina rake to something much smoother than Catania does."
      },
      {
        "name": "Helado de paila",
        "facets": {
          "base": [
            "fruit purée",
            "sugar syrup"
          ],
          "body": [
            "nothing added"
          ],
          "freeze": [
            "churned while freezing",
            "turned by hand in a copper pan"
          ],
          "air": [
            "a little beaten in"
          ],
          "region": [
            "Ecuador"
          ]
        },
        "note": "A copper bowl set on ice and salt and spun by hand with a wooden paddle. Rosalía Suárez has been credited with it in Ibarra since 1897, originally with ice carried down from the glacier on Imbabura."
      },
      {
        "name": "Faloodeh",
        "facets": {
          "base": [
            "sugar syrup",
            "rosewater",
            "lime juice"
          ],
          "body": [
            "starch noodles"
          ],
          "freeze": [
            "left still to freeze",
            "stirred to a slush"
          ],
          "air": [
            "none"
          ],
          "region": [
            "Iran"
          ]
        },
        "note": "Shiraz's answer, and one of the oldest in the family: cold starch vermicelli set through a half-frozen syrup, so every spoonful is chewy and icy at the same time."
      },
      {
        "name": "Kakigori",
        "facets": {
          "base": [
            "plain water",
            "sweetened after freezing",
            "syrup poured over"
          ],
          "body": [
            "nothing added"
          ],
          "freeze": [
            "frozen solid first",
            "shaved into flakes"
          ],
          "air": [
            "none"
          ],
          "region": [
            "Japan"
          ]
        },
        "note": "Water ice planed into flakes fine enough to melt on contact, sweetened only once it is in the bowl. The oldest move on this branch — shaved ice with sweet syrup is described in The Pillow Book a thousand years ago — and the one Japanese migrants carried to Manila in the 1920s and 30s."
      },
      {
        "name": "Halo-halo",
        "facets": {
          "base": [
            "plain water",
            "sweetened after freezing",
            "sweets layered underneath"
          ],
          "body": [
            "nothing added"
          ],
          "freeze": [
            "frozen solid first",
            "shaved into flakes"
          ],
          "air": [
            "none"
          ],
          "region": [
            "Philippines"
          ]
        },
        "note": "The ice itself is bare; everything that makes it a dessert is in the glass around it — ube, sweet beans, leche flan, evaporated milk poured over the top. The name means mix-mix, and the mixing is the instruction. The shaving came from Japan by way of the prewar mongo-ya stalls in Manila; what the Philippines added was everything underneath."
      },
      {
        "name": "Bingsu (milk snow)",
        "facets": {
          "base": [
            "milk base"
          ],
          "body": [
            "nothing added"
          ],
          "freeze": [
            "frozen solid first",
            "shaved into flakes"
          ],
          "air": [
            "none"
          ],
          "region": [
            "Korea"
          ]
        },
        "note": "Uyu bingsu, the café version of the 2000s: sweetened milk frozen into a block and shaved, so it comes out creamy in ribbons without ever being churned. The older patbingsu shaves plain water ice instead and puts the sweetness in the red bean, tteok and condensed milk on top. Neither this nor halo-halo invented the shaving; both sit downstream of kakigori."
      }
    ],
    "notes": [
      {
        "title": "On moving while it freezes",
        "body": "This is the largest fork in the family. Movement keeps ice crystals small, and small crystals are what the word creamy actually describes. Leave the mix still and you need another answer to the same problem: accept the crystals and make them the point (granita), trap the air beforehand in whipped cream and meringue (semifreddo), or boil the milk down until there is too little free water for crystals to grow at all (kulfi). Or refuse the question — freeze the liquid to a solid block and cut the crystals afterwards with a blade, which is what kakigori, halo-halo and bingsu do."
      },
      {
        "title": "On air",
        "body": "Air is the invisible ingredient, and the trade has a name — overrun, how much the mix expands in the machine. American ice cream may nearly double in volume so long as a gallon still weighs 4.5 pounds and carries 1.6 pounds of total solids. Gelato takes far less, which is why a small cup of it is surprisingly heavy. Frozen custard takes almost none. Same cream, same sugar, three desserts, and most of the difference is nothing."
      },
      {
        "title": "On what holds it together",
        "body": "Take the dairy fat out, or never put it in, and something else has to hold the thing together. The traditions here answer five ways: egg yolk in France, cornstarch in Sicily, salep and mastic in Maraş, starch noodles set through the syrup in Shiraz, and in North India no additive at all — milk boiled down until its own solids do the work. Sorbet, which really is frozen sugar-water, answers with the sugar itself: enough of it and the syrup never sets hard, too little and it sets like a rock. Granita declines the question and lets the crystals stand; halo-halo declines it too and builds the dessert around the ice instead. These are siblings solving one problem, not versions of each other."
      },
      {
        "title": "On the word sherbet",
        "body": "In American law sherbet is sorbet with 1 to 2 percent milkfat — one of two rows here drawn by a legal line rather than a kitchen one, frozen custard being the other at 1.4 percent egg yolk solids. In Britain sherbet is a fizzy sweet powder with nothing to do with any of this. Across much of the rest of the anglophone world it is simply what sorbet is called. Three things, one word — all of them descended from the Arabic sharbat."
      },
      {
        "title": "On shaved ice",
        "body": "The three shaved-ice rows are one technique in three places, and the ancestor is kakigori: freeze first, then make the texture with a blade. It reached Manila with Japanese migrants in the 1920s and 30s, where the mongo-ya stalls sold shaved ice over sweetened mung beans and halo-halo grew out of it. Korea's bingsu has its own long line in shaved ice, and the milk-snow version is recent enough to be a café invention. None of the three is a variant of another; the family resemblance is the blade."
      }
    ],
    "sources": [
      {
        "label": "Ice cream (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Ice_cream"
      },
      {
        "label": "21 CFR 135.110 — Ice cream and frozen custard",
        "url": "https://www.law.cornell.edu/cfr/text/21/135.110"
      },
      {
        "label": "21 CFR 135.140 — Sherbet",
        "url": "https://www.law.cornell.edu/cfr/text/21/135.140"
      },
      {
        "label": "Gelato",
        "url": "https://en.wikipedia.org/wiki/Gelato"
      },
      {
        "label": "Dondurma",
        "url": "https://en.wikipedia.org/wiki/Dondurma"
      },
      {
        "label": "Kulfi",
        "url": "https://en.wikipedia.org/wiki/Kulfi"
      },
      {
        "label": "Faloodeh",
        "url": "https://en.wikipedia.org/wiki/Faloodeh"
      },
      {
        "label": "Kakigori",
        "url": "https://en.wikipedia.org/wiki/Kakigori"
      },
      {
        "label": "Halo-halo",
        "url": "https://en.wikipedia.org/wiki/Halo-halo"
      },
      {
        "label": "Bingsu",
        "url": "https://en.wikipedia.org/wiki/Bingsu"
      },
      {
        "label": "Helado de paila",
        "url": "https://en.wikipedia.org/wiki/Helado_de_paila"
      }
    ],
    "yours": [
      "ice cream",
      "gelato",
      "sorbet",
      "sorbetto",
      "sherbet",
      "granita",
      "semifreddo",
      "kulfi",
      "frozen yogurt",
      "frozen custard",
      "soft serve",
      "faloodeh",
      "halo-halo",
      "kakigori",
      "dondurma",
      "bingsu",
      "helado de paila",
      "paila"
    ]
  },
  {
    "slug": "noodle-soup",
    "name": "Noodle soup",
    "standfirst": "Cook noodles, get hot broth onto them, put something on top. Every noodle-eating culture arrived at this, and then argued about the broth — whether to keep it clear, boil it cloudy, thicken it with pulses or toasted flour, cut it with coconut, or make it sour. The second argument is quieter: whether the cook finishes the bowl, or you do.",
    "root": "Noodles and hot broth in one bowl",
    "facets": [
      {
        "id": "broth",
        "label": "Broth"
      },
      {
        "id": "noodle",
        "label": "Noodle"
      },
      {
        "id": "top",
        "label": "On top"
      },
      {
        "id": "finish",
        "label": "At the table"
      },
      {
        "id": "region",
        "label": "Region"
      }
    ],
    "nestings": [
      {
        "label": "By broth",
        "by": [
          "broth",
          "noodle",
          "top"
        ]
      },
      {
        "label": "By noodle",
        "by": [
          "noodle",
          "broth"
        ]
      },
      {
        "label": "By who finishes it",
        "by": [
          "finish",
          "broth"
        ]
      },
      {
        "label": "By region",
        "by": [
          "region",
          "broth"
        ]
      }
    ],
    "dishes": [
      {
        "name": "Shoyu ramen",
        "facets": {
          "broth": [
            "clear",
            "chicken bones",
            "soy tare"
          ],
          "noodle": [
            "wheat",
            "alkaline",
            "wavy"
          ],
          "top": [
            "chashu pork",
            "menma",
            "nori",
            "spring onion"
          ],
          "finish": [
            "arrives finished"
          ],
          "region": [
            "Japan",
            "Tokyo"
          ]
        },
        "note": "The seasoning goes into the empty bowl before the broth does. By the time it reaches you the decision has been made."
      },
      {
        "name": "Tonkotsu ramen",
        "facets": {
          "broth": [
            "emulsified",
            "pork bones",
            "boiled hard for hours"
          ],
          "noodle": [
            "wheat",
            "alkaline",
            "thin",
            "straight"
          ],
          "top": [
            "chashu pork",
            "wood ear",
            "pickled ginger",
            "sesame"
          ],
          "finish": [
            "arrives finished",
            "a second helping of noodles"
          ],
          "region": [
            "Japan",
            "Fukuoka"
          ]
        },
        "note": "Same pork bones a clear stock would use, held at a rolling boil instead of a simmer. The noodle is thin because the broth clings to it."
      },
      {
        "name": "Wonton noodle soup",
        "facets": {
          "broth": [
            "clear",
            "pork bones",
            "dried flounder",
            "dried shrimp"
          ],
          "noodle": [
            "wheat",
            "alkaline",
            "duck egg",
            "very thin"
          ],
          "top": [
            "prawn wontons",
            "yellow chives",
            "choy sum"
          ],
          "finish": [
            "arrives finished",
            "pickled green chilli alongside"
          ],
          "region": [
            "China",
            "Guangdong"
          ]
        },
        "note": "The dried seafood does the work a long meat stock would do elsewhere — depth without cloudiness."
      },
      {
        "name": "Lanzhou beef lamian",
        "facets": {
          "broth": [
            "clear",
            "beef bones",
            "skimmed until transparent"
          ],
          "noodle": [
            "wheat",
            "hand-pulled",
            "gauge to order"
          ],
          "top": [
            "sliced beef",
            "white radish",
            "coriander",
            "chilli oil"
          ],
          "finish": [
            "finished by the eater",
            "black vinegar",
            "more chilli oil"
          ],
          "region": [
            "China",
            "Gansu"
          ]
        },
        "note": "Judged on the clarity of the broth, which is why the pot is skimmed and never allowed to boil — the beef cooks in it, then comes out to be sliced and laid on at the end."
      },
      {
        "name": "Hongshao niurou mian",
        "facets": {
          "broth": [
            "dark",
            "beef bones",
            "soy-braised",
            "doubanjiang"
          ],
          "noodle": [
            "wheat",
            "machine-cut",
            "thick"
          ],
          "top": [
            "braised beef shin",
            "pickled mustard greens",
            "spring onion"
          ],
          "finish": [
            "finished by the eater",
            "black vinegar",
            "chilli bean paste"
          ],
          "region": [
            "Taiwan"
          ]
        },
        "note": "Taiwan's red-braised bowl. Lanzhou's beef cooks in its broth too, but this beef is braised in soy and chilli bean paste first, so the colour goes into the pot and stays."
      },
      {
        "name": "Kalguksu",
        "facets": {
          "broth": [
            "clouded",
            "dried anchovy",
            "kelp",
            "noodle starch"
          ],
          "noodle": [
            "wheat",
            "knife-cut",
            "floury"
          ],
          "top": [
            "courgette",
            "potato",
            "seasoned soy dressing"
          ],
          "finish": [
            "finished by the eater",
            "fresh kimchi alongside"
          ],
          "region": [
            "Korea"
          ]
        },
        "note": "The noodles are boiled in the soup rather than beside it, so the flour on them thickens it. The noodle is an ingredient in the broth."
      },
      {
        "name": "Phở bò",
        "facets": {
          "broth": [
            "clear",
            "beef bones",
            "charred aromatics",
            "star anise"
          ],
          "noodle": [
            "rice",
            "flat",
            "fresh"
          ],
          "top": [
            "rare beef slices",
            "brisket",
            "spring onion"
          ],
          "finish": [
            "finished by the eater",
            "herb plate",
            "lime",
            "chilli sauce"
          ],
          "region": [
            "Vietnam",
            "Saigon"
          ]
        },
        "note": "The rare beef is cooked by the broth as it is poured. In the southern bowl everything else happens at your end of the table."
      },
      {
        "name": "Bún bò Huế",
        "facets": {
          "broth": [
            "clear",
            "beef bones",
            "pork bones",
            "lemongrass",
            "fermented shrimp paste"
          ],
          "noodle": [
            "rice",
            "thick",
            "round"
          ],
          "top": [
            "beef shank",
            "pork knuckle",
            "cubed pork blood",
            "annatto chilli oil"
          ],
          "finish": [
            "finished by the eater",
            "shredded banana blossom",
            "lime",
            "raw chilli"
          ],
          "region": [
            "Vietnam",
            "Huế"
          ]
        },
        "note": "Not a spicy phở. Different bone stock, different noodle, and a shrimp paste that phở would never allow."
      },
      {
        "name": "Curry laksa",
        "facets": {
          "broth": [
            "coconut",
            "prawn stock",
            "rempah paste"
          ],
          "noodle": [
            "rice",
            "thin",
            "round",
            "yellow wheat mixed in"
          ],
          "top": [
            "prawns",
            "tofu puffs",
            "cockles",
            "bean sprouts"
          ],
          "finish": [
            "finished by the eater",
            "sambal",
            "lime"
          ],
          "region": [
            "Malaysia",
            "Kuala Lumpur"
          ]
        },
        "note": "Two noodles in one bowl on purpose — the rice vermicelli carries the broth, the yellow wheat noodle stays springy in it."
      },
      {
        "name": "Asam laksa",
        "facets": {
          "broth": [
            "sour",
            "mackerel",
            "tamarind",
            "dried garcinia"
          ],
          "noodle": [
            "rice",
            "thick",
            "round"
          ],
          "top": [
            "flaked mackerel",
            "cucumber",
            "pineapple",
            "torch ginger bud"
          ],
          "finish": [
            "finished by the eater",
            "thick prawn paste",
            "mint",
            "raw onion"
          ],
          "region": [
            "Malaysia",
            "Penang"
          ]
        },
        "note": "Shares a name with curry laksa and almost nothing else. No coconut at all: the richness is replaced by sourness and raw fruit."
      },
      {
        "name": "Khao soi",
        "facets": {
          "broth": [
            "coconut",
            "chicken stock",
            "curry paste"
          ],
          "noodle": [
            "wheat",
            "egg",
            "boiled soft"
          ],
          "top": [
            "braised chicken leg",
            "the same noodle fried crisp",
            "shallot"
          ],
          "finish": [
            "finished by the eater",
            "pickled mustard greens",
            "shallot",
            "lime"
          ],
          "region": [
            "Thailand",
            "Chiang Mai"
          ]
        },
        "note": "The only bowl here that serves its noodle twice, once soft and once fried, so the texture changes as you eat."
      },
      {
        "name": "Mohinga",
        "facets": {
          "broth": [
            "thickened",
            "catfish",
            "toasted rice flour",
            "banana stem"
          ],
          "noodle": [
            "rice",
            "thin",
            "round"
          ],
          "top": [
            "split pea fritter",
            "boiled egg",
            "coriander",
            "fried garlic"
          ],
          "finish": [
            "finished by the eater",
            "lime",
            "fish sauce",
            "chilli flakes"
          ],
          "region": [
            "Myanmar"
          ]
        },
        "note": "Thickened with toasted rice flour rather than fat or coconut — a third way to make a broth cling."
      },
      {
        "name": "Soto ayam",
        "facets": {
          "broth": [
            "clear",
            "whole chicken",
            "turmeric",
            "lemongrass"
          ],
          "noodle": [
            "mung bean starch",
            "glass noodle",
            "soaked soft"
          ],
          "top": [
            "shredded chicken",
            "boiled egg",
            "fried shallots",
            "bean sprouts"
          ],
          "finish": [
            "finished by the eater",
            "sambal",
            "lime",
            "kecap manis"
          ],
          "region": [
            "Indonesia",
            "Java"
          ]
        },
        "note": "The only noodle here made from neither wheat nor rice. Glass noodles are soaked, not boiled, so they never cloud the broth."
      },
      {
        "name": "Ash reshteh",
        "facets": {
          "broth": [
            "thickened",
            "chickpeas",
            "lentils",
            "herbs"
          ],
          "noodle": [
            "wheat",
            "flat",
            "salted dough"
          ],
          "top": [
            "kashk",
            "fried mint",
            "fried onion"
          ],
          "finish": [
            "arrives finished",
            "extra kashk"
          ],
          "region": [
            "Iran"
          ]
        },
        "note": "No stock at all. The pulses are the body of the soup, and the noodles are salted so they season it as they cook."
      },
      {
        "name": "Chicken noodle soup",
        "facets": {
          "broth": [
            "clear",
            "whole chicken",
            "onion",
            "carrot"
          ],
          "noodle": [
            "wheat",
            "egg",
            "ribbon"
          ],
          "top": [
            "poached chicken",
            "carrot",
            "celery",
            "dill"
          ],
          "finish": [
            "arrives finished",
            "black pepper"
          ],
          "region": [
            "United States"
          ]
        },
        "note": "The plainest bowl in the family, and the clearest statement of the base: a gently simmered bird, an egg noodle, and nothing hiding. Ashkenazi in origin, and now thoroughly American."
      },
      {
        "name": "Yaka mein",
        "facets": {
          "broth": [
            "clear",
            "beef bones",
            "soy sauce",
            "creole seasoning"
          ],
          "noodle": [
            "wheat",
            "spaghetti"
          ],
          "top": [
            "stewed beef",
            "half a boiled egg",
            "spring onion"
          ],
          "finish": [
            "finished by the eater",
            "hot sauce",
            "soy sauce",
            "ketchup"
          ],
          "region": [
            "United States",
            "New Orleans"
          ]
        },
        "note": "A Chinese-American noodle soup that stayed in Black New Orleans and kept going. Spaghetti is not a substitution here; it is the noodle."
      }
    ],
    "notes": [
      {
        "title": "Clear or cloudy is one decision",
        "body": "A pot of bones held just under a simmer and skimmed stays transparent — that is Lanzhou beef lamian, and phở. The same bones at a hard rolling boil for eight or twelve hours drive fat and gelatine into suspension until the broth turns opaque and coats the noodle — that is tonkotsu. Nothing else changes. Emulsified broth is not a richer recipe than clear broth; it is a hotter one. Kalguksu clouds a third way, and a cooler one: flour off the noodles, not fat off the bones."
      },
      {
        "title": "Who finishes the bowl",
        "body": "A ramen bowl arrives with its seasoning already decided — the tare went into the empty bowl before the broth did, and reaching for the chilli is a comment on the cook. A bowl of phở in Saigon arrives deliberately incomplete, with herbs, lime and chilli on a plate beside it, and assembling it is the last step of the recipe rather than a garnish. Neither bowl is more finished than the other. They put the seasoning decision in different hands."
      },
      {
        "title": "The noodle is chosen for how it behaves in liquid",
        "body": "Alkaline wheat noodles resist going soft, which is why they can sit in boiling broth and be eaten slowly. Rice noodles absorb and go slippery, which is why phở is eaten fast. Knife-cut kalguksu noodles are floury on purpose and cloud the broth they cook in. And glass noodles are soaked rather than boiled, so they add nothing to the soup at all — which is exactly what a clear turmeric broth wants."
      },
      {
        "title": "Why nothing here has a parent",
        "body": "Every bowl in this family sits at the same depth, because none of them is another one plus a step. Khao soi is not laksa with different noodles and asam laksa is not curry laksa with the coconut taken out — they are separate answers to the same problem, arrived at independently, that happen to share a word. Lineage exists inside each tradition, not between them."
      }
    ],
    "sources": [
      {
        "label": "Ramen (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Ramen"
      },
      {
        "label": "Phở",
        "url": "https://en.wikipedia.org/wiki/Pho"
      },
      {
        "label": "Laksa",
        "url": "https://en.wikipedia.org/wiki/Laksa"
      },
      {
        "label": "Khao soi",
        "url": "https://en.wikipedia.org/wiki/Khao_soi"
      },
      {
        "label": "Mohinga",
        "url": "https://en.wikipedia.org/wiki/Mohinga"
      },
      {
        "label": "Beef noodle soup",
        "url": "https://en.wikipedia.org/wiki/Beef_noodle_soup"
      },
      {
        "label": "Kalguksu",
        "url": "https://en.wikipedia.org/wiki/Kalguksu"
      },
      {
        "label": "Ash-e reshteh",
        "url": "https://en.wikipedia.org/wiki/Ash_reshteh"
      },
      {
        "label": "Yaka mein",
        "url": "https://en.wikipedia.org/wiki/Yaka_mein"
      }
    ],
    "yours": [
      "noodle soup",
      "ramen",
      "pho",
      "laksa",
      "khao soi",
      "beef noodle",
      "wonton",
      "kalguksu",
      "soto",
      "mohinga",
      "broth bowl"
    ]
  },
  {
    "slug": "pancake",
    "name": "Pancake",
    "standfirst": "Every one of these is starch and liquid meeting a hot surface. Fourteen work from a flour — wheat, buckwheat, semolina, rice, millet, mung bean — and two take the starch straight out of the vegetable, grated or ground raw. Fifteen cook over the flame on a griddle or in a pan; the sixteenth goes into a hot skillet and then into the oven. What separates them is what lifts the batter, how loose or stiff it is, what it lands on, and whether it ends up sweet or savoury.",
    "root": "Starch, ground or grated · liquid · a hot pan or griddle",
    "facets": [
      {
        "id": "lift",
        "label": "Leavening"
      },
      {
        "id": "batter",
        "label": "Batter"
      },
      {
        "id": "surface",
        "label": "Cooked on"
      },
      {
        "id": "register",
        "label": "Sweet or savoury"
      },
      {
        "id": "region",
        "label": "Region"
      }
    ],
    "nestings": [
      {
        "label": "By leavening",
        "by": [
          "lift",
          "batter",
          "surface"
        ]
      },
      {
        "label": "By cooking surface",
        "by": [
          "surface",
          "batter",
          "register"
        ]
      },
      {
        "label": "By region",
        "by": [
          "region",
          "lift"
        ]
      }
    ],
    "dishes": [
      {
        "name": "American stack",
        "facets": {
          "lift": [
            "chemical leavening",
            "baking powder"
          ],
          "batter": [
            "pourable",
            "wheat flour"
          ],
          "surface": [
            "flat griddle",
            "flipped once"
          ],
          "register": [
            "sweet",
            "maple syrup poured over"
          ],
          "region": [
            "United States"
          ]
        },
        "note": "The only one here that is stacked. Baking powder is what makes that possible — a chemical lift works in the minute between mixing and the griddle, so the batter can be thick and still rise."
      },
      {
        "name": "Crêpe",
        "facets": {
          "lift": [
            "none"
          ],
          "batter": [
            "thin enough to swirl",
            "wheat flour",
            "rested"
          ],
          "surface": [
            "flat griddle",
            "flipped once"
          ],
          "register": [
            "either way"
          ],
          "region": [
            "Brittany"
          ]
        },
        "note": "Nothing lifts it, so the rest is the whole technique: an hour off the heat lets the flour drink and the gluten slacken, which is why it swirls to the edge instead of tearing."
      },
      {
        "name": "Blini",
        "facets": {
          "lift": [
            "yeast"
          ],
          "batter": [
            "pourable",
            "buckwheat flour"
          ],
          "surface": [
            "shallow pan",
            "flipped once"
          ],
          "register": [
            "either way"
          ],
          "region": [
            "Russia"
          ]
        },
        "note": "Yeast is the older lift, and it costs hours rather than minutes. What it buys is sourness, which is why buckwheat and salt fish sit on the same plate without either winning."
      },
      {
        "name": "Baghrir",
        "facets": {
          "lift": [
            "yeast"
          ],
          "batter": [
            "thin enough to swirl",
            "semolina"
          ],
          "surface": [
            "flat griddle",
            "one side only"
          ],
          "register": [
            "sweet",
            "drenched in honey"
          ],
          "region": [
            "Morocco"
          ]
        },
        "note": "The thousand holes are the point, and they only exist because it is never turned: steam escapes upward through a thin yeasted batter and leaves the top open. Flip it and you close the sponge that the honey is supposed to soak into."
      },
      {
        "name": "Jianbing",
        "facets": {
          "lift": [
            "none"
          ],
          "batter": [
            "thin enough to swirl",
            "millet flour"
          ],
          "surface": [
            "flat griddle",
            "flipped once",
            "spread with a scraper"
          ],
          "register": [
            "savoury"
          ],
          "region": [
            "Shandong"
          ]
        },
        "note": "A wooden rake rather than a wrist does the spreading, which is what lets one crêpe cover a whole edgeless griddle. An egg is broken onto the raw side and spread the same way before it is turned."
      },
      {
        "name": "Jianbing guozi",
        "parent": "Jianbing",
        "facets": {
          "lift": [
            "none"
          ],
          "batter": [
            "thin enough to swirl",
            "mung bean flour"
          ],
          "surface": [
            "flat griddle",
            "flipped once",
            "spread with a scraper"
          ],
          "register": [
            "savoury",
            "a crisp cracker folded in"
          ],
          "region": [
            "Tianjin"
          ]
        },
        "note": "Jianbing plus the guozi — a sheet of fried cracker or a length of youtiao laid on before folding. It descends from the Shandong pancake rather than from the base, and Tianjin swapped millet for mung bean along the way, which is why it is the softer of the two."
      },
      {
        "name": "Bánh xèo",
        "facets": {
          "lift": [
            "none"
          ],
          "batter": [
            "thin enough to swirl",
            "rice flour",
            "coconut milk",
            "turmeric"
          ],
          "surface": [
            "shallow pan",
            "generous oil",
            "one side only",
            "folded over"
          ],
          "register": [
            "savoury",
            "wrapped in lettuce at the table"
          ],
          "region": [
            "Vietnam"
          ]
        },
        "note": "The name is the sizzle the batter makes hitting hot fat. Coconut milk in the batter and enough oil to fry rather than griddle are what make it shatter, and a lid cooks the top so the underside never has to leave the oil — this is the only thin pancake here that is crisp all the way through."
      },
      {
        "name": "Pajeon",
        "facets": {
          "lift": [
            "none"
          ],
          "batter": [
            "pourable",
            "wheat flour"
          ],
          "surface": [
            "shallow pan",
            "generous oil",
            "flipped once"
          ],
          "register": [
            "savoury",
            "scallions laid in whole"
          ],
          "region": [
            "Korea"
          ]
        },
        "note": "The scallions go in at full length and the batter is barely enough to hold them, so this is closer to a raft than a cake. Batter here is glue, not body."
      },
      {
        "name": "Okonomiyaki",
        "facets": {
          "lift": [
            "air beaten in",
            "grated yam"
          ],
          "batter": [
            "thick enough to mound",
            "wheat flour",
            "shredded cabbage"
          ],
          "surface": [
            "flat griddle",
            "flipped once"
          ],
          "register": [
            "savoury",
            "sauce brushed on top"
          ],
          "region": [
            "Osaka"
          ]
        },
        "note": "Cabbage is most of the volume and the batter only binds it, which is why it mounds instead of spreading. Nothing ferments or fizzes here: grated nagaimo holds the air that is beaten into the batter, and that is the whole of the lift. Hiroshima builds the same parts in layers over a nest of noodles rather than mixing them."
      },
      {
        "name": "Hotteok",
        "facets": {
          "lift": [
            "yeast"
          ],
          "batter": [
            "stiff enough to knead",
            "wheat flour",
            "glutinous rice flour"
          ],
          "surface": [
            "flat griddle",
            "flipped once",
            "pressed flat"
          ],
          "register": [
            "sweet",
            "filled with brown sugar syrup"
          ],
          "region": [
            "Korea"
          ]
        },
        "note": "The far end of the thickness column: stiff enough to be handled, so the sugar can be sealed inside before a press flattens it on the griddle. The filling only becomes syrup once it is already shut in."
      },
      {
        "name": "Apam balik",
        "facets": {
          "lift": [
            "yeast",
            "baking soda"
          ],
          "batter": [
            "pourable",
            "wheat flour"
          ],
          "surface": [
            "flat griddle",
            "one side only",
            "folded over"
          ],
          "register": [
            "sweet",
            "filled with crushed peanuts"
          ],
          "region": [
            "Malaysia"
          ]
        },
        "note": "Both lifts at once — yeast for the open crumb, soda for the lacy edge. Like baghrir it is never turned, but the untouched top is a surface to fill rather than to soak."
      },
      {
        "name": "Dutch baby",
        "facets": {
          "lift": [
            "steam alone"
          ],
          "batter": [
            "pourable",
            "wheat flour",
            "more egg than flour"
          ],
          "surface": [
            "hot oven",
            "preheated skillet",
            "never turned"
          ],
          "register": [
            "sweet",
            "lemon squeezed over"
          ],
          "region": [
            "United States"
          ]
        },
        "note": "Nothing is added to lift it, and it climbs the highest of any of them. Water in a very eggy batter flashes to steam faster than the egg can set, so the walls are pushed up and then held there — which is also why it collapses on the way to the table."
      },
      {
        "name": "Æbleskiver",
        "facets": {
          "lift": [
            "air beaten in",
            "whipped egg white"
          ],
          "batter": [
            "pourable",
            "wheat flour"
          ],
          "surface": [
            "dimpled pan",
            "turned into a sphere"
          ],
          "register": [
            "sweet",
            "jam on the side"
          ],
          "region": [
            "Denmark"
          ]
        },
        "note": "The whites go in beaten and folded, so the lift is air that is already in the batter before it meets the iron. A knitting needle then turns each one a quarter at a time so the raw batter runs down and sets on the outside — the ball is built in three or four turns rather than one flip."
      },
      {
        "name": "Poffertjes",
        "facets": {
          "lift": [
            "yeast"
          ],
          "batter": [
            "pourable",
            "buckwheat flour"
          ],
          "surface": [
            "dimpled pan",
            "flipped once"
          ],
          "register": [
            "sweet",
            "buried in icing sugar"
          ],
          "region": [
            "Netherlands"
          ]
        },
        "note": "The same dimpled iron as æbleskiver and the opposite decision at every other column: yeast instead of egg white, buckwheat instead of wheat, and one flip, so it stays a disc."
      },
      {
        "name": "Latke",
        "facets": {
          "lift": [
            "none"
          ],
          "batter": [
            "thick enough to mound",
            "grated potato instead of flour"
          ],
          "surface": [
            "shallow pan",
            "deep oil",
            "flipped once"
          ],
          "register": [
            "savoury"
          ],
          "region": [
            "Ashkenazi Europe"
          ]
        },
        "note": "The starch is the vegetable itself — squeeze the grated potato and the starch that settles out is what binds the rest. Nothing is poured, and the oil is the whole occasion."
      },
      {
        "name": "Cachapa",
        "facets": {
          "lift": [
            "none"
          ],
          "batter": [
            "pourable",
            "fresh corn ground raw"
          ],
          "surface": [
            "flat griddle",
            "flipped once"
          ],
          "register": [
            "either way"
          ],
          "region": [
            "Venezuela"
          ]
        },
        "note": "Not corn flour but whole kernels cut from the cob and blitzed, so the batter is milk from the corn itself. It arrives sweet and gets a slab of salted queso de mano folded into it, and refuses to pick a side."
      }
    ],
    "notes": [
      {
        "title": "On not turning it over",
        "body": "Three of these are cooked on one side only, and in each case it is a decision rather than an omission. Baghrir and apam balik leave the top bare: a thin yeasted batter lets steam escape upward and sets the surface open and porous, which baghrir wants so it can drink honey and apam balik wants as a floor for peanuts and sugar before folding. Bánh xèo reaches the same rule from the other end — a lid cooks the top with trapped steam so the underside can stay down in the oil until it shatters. Turn any of the three and you undo the thing the single side was for. The Dutch baby is never turned either, but nothing turns it because nothing has to: in the oven the heat is already on every side at once."
      },
      {
        "title": "On what lifts it",
        "body": "Four answers, and only one of them is a packet. Yeast is the oldest and the slowest, and it pays in sourness as well as rise. Chemical leavening works in the minute between the bowl and the griddle, which is what a thick American stack needs. Air can simply be beaten in and held there — by whipped whites in æbleskiver, by the mucilage of grated yam in okonomiyaki — and it is a lift with no flavour of its own. And the water already in the batter will do the job unaided if the oven is hot enough and the batter eggy enough, which is the whole trick of the Dutch baby. Seven of the sixteen use none of them and are none the worse for it."
      },
      {
        "title": "On the dimpled pan",
        "body": "Æbleskiver and poffertjes share a piece of cast iron and almost nothing else. Given the same hollows, Denmark turns each portion repeatedly until it closes into a sphere and Holland flips it once and leaves it flat. The pan is a constraint, not an answer."
      },
      {
        "title": "Where the family ends",
        "body": "Dosa and injera are batters on griddles too, but both are fermented for days and both are eaten as the bread of a meal rather than as the dish — they sit with flatbread. The line drawn here is a batter mixed and cooked in the same session, served as itself."
      },
      {
        "title": "On depth",
        "body": "Only jianbing guozi sits a level down, because it genuinely is jianbing with the guozi folded inside. The other fifteen are each one decision from the base and belong at the same depth, however tempting it is to call a crêpe the parent of everything thin."
      }
    ],
    "sources": [
      {
        "label": "Pancake (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Pancake"
      },
      {
        "label": "Jianbing guozi",
        "url": "https://en.wikipedia.org/wiki/Jianbing_guozi"
      },
      {
        "label": "Baghrir",
        "url": "https://en.wikipedia.org/wiki/Baghrir"
      },
      {
        "label": "Okonomiyaki",
        "url": "https://en.wikipedia.org/wiki/Okonomiyaki"
      },
      {
        "label": "Bánh xèo",
        "url": "https://en.wikipedia.org/wiki/B%C3%A1nh_x%C3%A8o"
      },
      {
        "label": "Cachapa",
        "url": "https://en.wikipedia.org/wiki/Cachapa"
      },
      {
        "label": "Æbleskiver",
        "url": "https://en.wikipedia.org/wiki/%C3%86bleskiver"
      },
      {
        "label": "Apam balik",
        "url": "https://en.wikipedia.org/wiki/Apam_balik"
      }
    ],
    "yours": [
      "pancake",
      "pancakes",
      "crepe",
      "crêpe",
      "blini",
      "blintz",
      "baghrir",
      "jianbing",
      "banh xeo",
      "bánh xèo",
      "pajeon",
      "okonomiyaki",
      "hotteok",
      "apam balik",
      "dutch baby",
      "aebleskiver",
      "æbleskiver",
      "poffertjes",
      "latke",
      "cachapa"
    ]
  },
  {
    "slug": "raw-cured-fish",
    "name": "Raw and cured fish",
    "standfirst": "No pan, no fire. The fish is changed by a knife and by whatever you lay on it — acid, salt, sugar, time — and every coast stopped at a different point along that line. Crudo and ceviche are about ninety seconds apart. Ceviche and gravlax are three days apart. Everything here is one of those decisions.",
    "root": "A fish that never meets heat",
    "facets": [
      {
        "id": "acid",
        "label": "Acid"
      },
      {
        "id": "cure",
        "label": "Cure"
      },
      {
        "id": "cut",
        "label": "Cut"
      },
      {
        "id": "dress",
        "label": "Dressed"
      },
      {
        "id": "region",
        "label": "Region"
      }
    ],
    "nestings": [
      {
        "label": "By acid",
        "by": [
          "acid",
          "cure",
          "cut"
        ]
      },
      {
        "label": "By cure",
        "by": [
          "cure",
          "cut"
        ]
      },
      {
        "label": "By region",
        "by": [
          "region",
          "acid"
        ]
      }
    ],
    "dishes": [
      {
        "name": "Sashimi",
        "facets": {
          "acid": [
            "no acid"
          ],
          "cure": [
            "no cure"
          ],
          "cut": [
            "sliced across the grain",
            "thick rectangles"
          ],
          "dress": [
            "soy sauce",
            "wasabi",
            "shredded daikon"
          ],
          "region": [
            "Japan"
          ]
        },
        "note": "The zero point of the family: nothing is done to the fish but the cut. Which means the cut carries the whole dish — angle, thickness, and which muscle you took it from."
      },
      {
        "name": "Crudo",
        "facets": {
          "acid": [
            "citrus juice",
            "dressed at the plate"
          ],
          "cure": [
            "salted at the plate"
          ],
          "cut": [
            "sliced across the grain",
            "paper-thin"
          ],
          "dress": [
            "olive oil"
          ],
          "region": [
            "Italy"
          ]
        },
        "note": "Sashimi's Mediterranean sibling, not only its descendant. Salt and lemon arrive seconds before the fork does, so they season rather than cure."
      },
      {
        "name": "Poke",
        "facets": {
          "acid": [
            "no acid"
          ],
          "cure": [
            "salted at the plate"
          ],
          "cut": [
            "cut in cubes"
          ],
          "dress": [
            "limu seaweed",
            "ʻinamona"
          ],
          "region": [
            "Hawaii"
          ]
        },
        "note": "Older than the soy-and-sesame bowl it became: sea salt, limu and ʻinamona — roasted kukui nut — on cubed aku. The cube is the point. It is fish cut to be eaten with the fingers."
      },
      {
        "name": "Hoe",
        "facets": {
          "acid": [
            "no acid"
          ],
          "cure": [
            "no cure"
          ],
          "cut": [
            "sliced across the grain",
            "thin ribbons"
          ],
          "dress": [
            "chogochujang",
            "ssam leaves",
            "raw garlic"
          ],
          "region": [
            "Korea"
          ]
        },
        "note": "Korean raw fish, cut thinner and chewier than sashimi and built for wrapping. The vinegar is in the dipping sauce, so it meets the fish for one second per bite — a sauce, never a cure."
      },
      {
        "name": "Hoedeopbap",
        "parent": "Hoe",
        "facets": {
          "acid": [
            "no acid"
          ],
          "cure": [
            "no cure"
          ],
          "cut": [
            "cut in cubes"
          ],
          "dress": [
            "chogochujang",
            "hot rice",
            "shredded vegetables"
          ],
          "region": [
            "Korea"
          ]
        },
        "note": "Hoe put over rice and stirred. Once it goes in a bowl with a spoon the ribbon stops working, so the fish is cubed — the vessel changed the cut."
      },
      {
        "name": "Yusheng",
        "facets": {
          "acid": [
            "citrus juice",
            "dressed at the plate"
          ],
          "cure": [
            "no cure"
          ],
          "cut": [
            "sliced across the grain",
            "paper-thin"
          ],
          "dress": [
            "plum sauce",
            "shredded vegetables"
          ],
          "region": [
            "Singapore"
          ]
        },
        "note": "Teochew raw fish rebuilt in 1960s Singapore as a Lunar New Year ritual, with Seremban in Malaysia disputing the credit. Everyone stands and tosses it as high as they can: the only dish here whose serving move is the dish."
      },
      {
        "name": "Ceviche",
        "facets": {
          "acid": [
            "citrus juice",
            "minutes in the acid"
          ],
          "cure": [
            "salted at the plate"
          ],
          "cut": [
            "cut in cubes"
          ],
          "dress": [
            "red onion",
            "ají limo",
            "sweet potato alongside"
          ],
          "region": [
            "Peru"
          ]
        },
        "note": "The lime is a clock. Modern Lima counts in single minutes; the older style left it far longer and ate the fish opaque all the way through."
      },
      {
        "name": "Tiradito",
        "parent": "Ceviche",
        "facets": {
          "acid": [
            "citrus juice",
            "dressed at the plate"
          ],
          "cure": [
            "salted at the plate"
          ],
          "cut": [
            "sliced across the grain",
            "thin ribbons"
          ],
          "dress": [
            "ají amarillo cream",
            "no onion"
          ],
          "region": [
            "Peru"
          ]
        },
        "note": "Ceviche cut by a Japanese hand: sliced instead of cubed, sauce poured over at the last second instead of marinated in, onion dropped entirely. Three changes, one of them the knife."
      },
      {
        "name": "Aguachile",
        "facets": {
          "acid": [
            "citrus juice",
            "dressed at the plate"
          ],
          "cure": [
            "salted in the liquid"
          ],
          "cut": [
            "sliced across the grain",
            "paper-thin"
          ],
          "dress": [
            "chile blitzed with lime",
            "cucumber",
            "red onion"
          ],
          "region": [
            "Mexico"
          ]
        },
        "note": "Sinaloa's answer, and the fastest thing here — the salt goes into the chile water rather than onto the fish, so the whole seasoning arrives as a liquid and you eat at once. Classically butterflied shrimp; fish is cut thin for the same reason, so the liquid never gets time to go past the surface."
      },
      {
        "name": "Kinilaw",
        "facets": {
          "acid": [
            "vinegar",
            "minutes in the acid"
          ],
          "cure": [
            "salted at the plate"
          ],
          "cut": [
            "cut in cubes"
          ],
          "dress": [
            "ginger",
            "chilli",
            "onion"
          ],
          "region": [
            "Philippines"
          ]
        },
        "note": "Not ceviche with a different passport. Coconut or cane vinegar rather than citrus, and fish bones found with tabon-tabon husks in Butuan put the technique roughly a thousand years back — centuries before any Spanish ship."
      },
      {
        "name": "Kokoda",
        "facets": {
          "acid": [
            "citrus juice",
            "hours in the acid"
          ],
          "cure": [
            "salted at the plate"
          ],
          "cut": [
            "cut in cubes"
          ],
          "dress": [
            "coconut cream",
            "chilli",
            "tomato"
          ],
          "region": [
            "Fiji"
          ]
        },
        "note": "Cured long, then drained and drowned in coconut cream — the fat is what stops the acid. Traditionally walu in lime and seawater; the coconut milk only arrived in the 1930s."
      },
      {
        "name": "Shime saba",
        "facets": {
          "acid": [
            "vinegar",
            "minutes in the acid"
          ],
          "cure": [
            "packed in salt",
            "drawn for hours"
          ],
          "cut": [
            "cured whole",
            "sliced thick"
          ],
          "dress": [
            "grated ginger",
            "soy sauce"
          ],
          "region": [
            "Japan"
          ]
        },
        "note": "Salt first to pull water out, vinegar second to go into the space it left — hours in the salt, well under an hour in the vinegar. Do it the other way round and the vinegar sits on wet flesh and does nothing. This is the hinge of the whole family."
      },
      {
        "name": "Rollmops",
        "facets": {
          "acid": [
            "vinegar",
            "days in the acid"
          ],
          "cure": [
            "brined in salt",
            "sugared"
          ],
          "cut": [
            "cured whole",
            "rolled around a pickle"
          ],
          "dress": [
            "onion",
            "gherkin",
            "mustard seed"
          ],
          "region": [
            "Germany"
          ]
        },
        "note": "The far end of the acid axis: days, not minutes, until the bones dissolve and the fillet will hold a curl. Ceviche and this are the same decision taken to opposite extremes."
      },
      {
        "name": "Matjes",
        "facets": {
          "acid": [
            "no acid"
          ],
          "cure": [
            "brined in salt",
            "ripened in the barrel"
          ],
          "cut": [
            "cured whole",
            "left in one piece"
          ],
          "dress": [
            "raw onion",
            "chopped pickle"
          ],
          "region": [
            "Netherlands"
          ]
        },
        "note": "Gibbed rather than gutted — the pancreas is deliberately left in so its enzymes soften the flesh from inside during the brine. The only dish here cured by the fish itself."
      },
      {
        "name": "Gravlax",
        "facets": {
          "acid": [
            "no acid"
          ],
          "cure": [
            "packed in salt",
            "sugared",
            "drawn for days"
          ],
          "cut": [
            "cured whole",
            "sliced paper-thin",
            "on the slant"
          ],
          "dress": [
            "dill",
            "mustard and dill sauce"
          ],
          "region": [
            "Sweden"
          ]
        },
        "note": "Sugar is not there for sweetness. It holds water in the flesh that salt alone would strip, which is why gravlax stays supple where a straight salt cure goes firm. Swedish by name; Norway cures the same fish as gravlaks."
      },
      {
        "name": "Mojama",
        "facets": {
          "acid": [
            "no acid"
          ],
          "cure": [
            "packed in salt",
            "air-dried for weeks"
          ],
          "cut": [
            "cured whole",
            "sliced paper-thin"
          ],
          "dress": [
            "olive oil",
            "almonds"
          ],
          "region": [
            "Spain"
          ]
        },
        "note": "Salt and then wind, until a tuna loin is dense enough to shave like ham. Phoenician in origin, and the same logic as prosciutto applied to a fish."
      }
    ],
    "notes": [
      {
        "title": "On what acid actually does",
        "body": "Acid unwinds protein the way heat does, which is why ceviche turns opaque. What it does not do is travel. Heat conducts through a piece of fish; acid only works where it is touching, creeping inward a millimetre at a time. That single fact explains the whole acid column: if you want the fish cured through you cube it and wait, and if you want it barely touched you slice it thin and pour the sauce as it leaves the kitchen. Cut and time are the same dial read from two ends."
      },
      {
        "title": "On cutting before or after",
        "body": "Look down the Cut column and it splits cleanly. Everything uncured is cut first and dressed second — the knife makes the dish. Everything cured is cured whole and cut last, because salt needs a solid piece to draw against and a sliced fillet would simply go to pieces in the box. Gravlax, mojama, shime saba and matjes are not slow versions of sashimi; they are a different order of operations."
      },
      {
        "title": "On smoke",
        "body": "Cold-smoked salmon — lox, or Nova — is gravlax's near-twin: the same salt cure, then smoke where the dill would be, and the fish still never gets warm enough to cook. It is missing from the table because smoke would be a column with one entry in it. But it is the obvious next decision, and worth knowing that it sits one step off gravlax rather than anywhere near the raw end of the family."
      },
      {
        "title": "On one dish under four flags",
        "body": "Kokoda is also ʻota ʻika in Tonga, oka iʻa in Samoa and poisson cru in Tahiti — one dish under four flags, and the Tongan version is a national dish. They are listed once here rather than four times, but none of them is a variation of the others. The same warning applies across the table: kinilaw is not Filipino ceviche and tiradito is not Peruvian sashimi. Only tiradito genuinely descends from its neighbour, because Peru is where both parents were standing."
      }
    ],
    "sources": [
      {
        "label": "Sashimi (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Sashimi"
      },
      {
        "label": "Ceviche",
        "url": "https://en.wikipedia.org/wiki/Ceviche"
      },
      {
        "label": "Tiradito",
        "url": "https://en.wikipedia.org/wiki/Tiradito"
      },
      {
        "label": "Kinilaw",
        "url": "https://en.wikipedia.org/wiki/Kinilaw"
      },
      {
        "label": "ʻOta ʻika",
        "url": "https://en.wikipedia.org/wiki/%27Ota_%27ika"
      },
      {
        "label": "Poke",
        "url": "https://en.wikipedia.org/wiki/Poke_(dish)"
      },
      {
        "label": "Hoe (dish)",
        "url": "https://en.wikipedia.org/wiki/Hoe_(dish)"
      },
      {
        "label": "Yusheng",
        "url": "https://en.wikipedia.org/wiki/Yusheng"
      },
      {
        "label": "Gravlax",
        "url": "https://en.wikipedia.org/wiki/Gravlax"
      },
      {
        "label": "Soused herring",
        "url": "https://en.wikipedia.org/wiki/Soused_herring"
      },
      {
        "label": "Mojama",
        "url": "https://en.wikipedia.org/wiki/Mojama"
      },
      {
        "label": "Aguachile",
        "url": "https://en.wikipedia.org/wiki/Aguachile"
      }
    ],
    "yours": [
      "ceviche",
      "sashimi",
      "poke",
      "crudo",
      "tiradito",
      "gravlax",
      "cured salmon",
      "kinilaw",
      "raw fish"
    ]
  },
  {
    "slug": "rice",
    "name": "Cooked rice",
    "standfirst": "One grain and one pot, and four decisions that separate every pot of rice on earth: how much liquid, what happens to the grain before it meets that liquid, whether it is stirred or left alone, and whether you want the bottom to catch. Answer them one way and you have risotto. Answer them another and you have biryani. None of these is a variation on any of the others — they are separate answers to the same grain.",
    "root": "Rice, water and heat",
    "facets": [
      {
        "id": "grain",
        "label": "Grain"
      },
      {
        "id": "prep",
        "label": "Prepared"
      },
      {
        "id": "liquid",
        "label": "Liquid"
      },
      {
        "id": "cook",
        "label": "Cooked"
      },
      {
        "id": "region",
        "label": "Region"
      }
    ],
    "nestings": [
      {
        "label": "By liquid",
        "by": [
          "liquid",
          "cook",
          "prep"
        ]
      },
      {
        "label": "By handling",
        "by": [
          "cook",
          "prep",
          "grain"
        ]
      },
      {
        "label": "By region",
        "by": [
          "region",
          "liquid"
        ]
      }
    ],
    "dishes": [
      {
        "name": "Gohan",
        "facets": {
          "grain": [
            "short-grain japonica"
          ],
          "prep": [
            "washed",
            "soaked"
          ],
          "liquid": [
            "measured liquid",
            "water"
          ],
          "cook": [
            "left alone",
            "lid on",
            "rested off the heat"
          ],
          "region": [
            "Japan"
          ]
        },
        "note": "The plainest possible answer and the most exacting one: the water is measured against the grain rather than the pot, and the lid is not lifted to check."
      },
      {
        "name": "Boiled rice",
        "facets": {
          "grain": [
            "long-grain"
          ],
          "prep": [
            "washed"
          ],
          "liquid": [
            "excess water",
            "salted"
          ],
          "cook": [
            "drained",
            "returned to the pot",
            "dried off the heat"
          ],
          "region": [
            "Worldwide"
          ]
        },
        "note": "Cooked like pasta, in far more water than the grain can take, and poured off when it is done. Most of the world's rice is cooked this way and it is the least written about, which is why it belongs to no one country here."
      },
      {
        "name": "Khao niao",
        "facets": {
          "grain": [
            "glutinous rice"
          ],
          "prep": [
            "washed",
            "soaked overnight"
          ],
          "liquid": [
            "steam only",
            "water kept below the grain"
          ],
          "cook": [
            "steamed over water",
            "in a bamboo basket",
            "flipped once"
          ],
          "region": [
            "Laos"
          ]
        },
        "note": "No liquid ever touches the grain. The overnight soak does what boiling would do, and steam only finishes it — which is why it can be picked up and eaten with the fingers."
      },
      {
        "name": "Congee",
        "facets": {
          "grain": [
            "jasmine rice"
          ],
          "prep": [
            "washed"
          ],
          "liquid": [
            "far more liquid than grain",
            "water"
          ],
          "cook": [
            "stirred as it thickens",
            "simmered until the grain collapses"
          ],
          "region": [
            "China"
          ]
        },
        "note": "Ten times the water and enough time, and the starch leaves the grain entirely. The rice is washed like any other pot of rice; the body comes from the collapse, not from anything left on the outside of the grain."
      },
      {
        "name": "Kheer",
        "facets": {
          "grain": [
            "broken basmati"
          ],
          "prep": [
            "washed"
          ],
          "liquid": [
            "far more liquid than grain",
            "whole milk"
          ],
          "cook": [
            "stirred as it thickens",
            "reduced",
            "sweetened late"
          ],
          "region": [
            "South Asia"
          ]
        },
        "note": "Congee's decisions taken in milk. Rice pudding is a porridge in every language that has one — the sugar arrives at the end and changes nothing about the method."
      },
      {
        "name": "Nasi lemak",
        "facets": {
          "grain": [
            "long-grain"
          ],
          "prep": [
            "washed",
            "soaked"
          ],
          "liquid": [
            "measured liquid",
            "coconut milk"
          ],
          "cook": [
            "left alone",
            "lid on",
            "pandan in the pot"
          ],
          "region": [
            "Malaysia"
          ]
        },
        "note": "The absorption method with the water swapped out. Fat in the cooking liquid coats every grain from the inside, which is a different thing from stirring fat in afterwards."
      },
      {
        "name": "Pulao",
        "facets": {
          "grain": [
            "basmati"
          ],
          "prep": [
            "washed",
            "soaked",
            "toasted in ghee"
          ],
          "liquid": [
            "measured liquid",
            "stock"
          ],
          "cook": [
            "left alone",
            "lid on",
            "rested off the heat"
          ],
          "region": [
            "South Asia"
          ]
        },
        "note": "Toasting the grain in fat before the liquid arrives seals the outside of each one. That single step is what keeps the grains separate, and it is what makes a pilaf a pilaf."
      },
      {
        "name": "Plov",
        "facets": {
          "grain": [
            "medium-grain",
            "devzira"
          ],
          "prep": [
            "washed",
            "soaked in salted water"
          ],
          "liquid": [
            "measured liquid",
            "the zirvak broth"
          ],
          "cook": [
            "left alone",
            "lid on",
            "rice sits on top of the base"
          ],
          "region": [
            "Uzbekistan"
          ]
        },
        "note": "The rice never meets a spoon. Meat and carrot are cooked down into a zirvak first, the rice is laid over it, and everything above cooks in the steam coming up through it."
      },
      {
        "name": "Risotto",
        "facets": {
          "grain": [
            "short-grain",
            "arborio"
          ],
          "prep": [
            "not washed",
            "toasted in butter"
          ],
          "liquid": [
            "added a ladle at a time",
            "hot stock"
          ],
          "cook": [
            "stirred constantly",
            "uncovered",
            "finished with butter"
          ],
          "region": [
            "Northern Italy"
          ]
        },
        "note": "The stirring is not fussiness. Grains rubbing against each other shed starch into the stock, so the sauce is made out of the rice rather than added to it — which is also why the rice is never washed."
      },
      {
        "name": "Paella",
        "facets": {
          "grain": [
            "short-grain",
            "bomba"
          ],
          "prep": [
            "not washed",
            "toasted in the sofrito"
          ],
          "liquid": [
            "measured liquid",
            "stock",
            "poured in once"
          ],
          "cook": [
            "left alone",
            "uncovered",
            "crust wanted",
            "spread thin"
          ],
          "region": [
            "Valencia"
          ]
        },
        "note": "Risotto's opposite instruction given to a similarly starchy grain: spread one layer deep and never touched, so the starch stays where it is and the bottom is allowed to catch into socarrat."
      },
      {
        "name": "Chelow",
        "facets": {
          "grain": [
            "long-grain",
            "aromatic"
          ],
          "prep": [
            "washed",
            "soaked in salted water",
            "parboiled"
          ],
          "liquid": [
            "excess water",
            "heavily salted"
          ],
          "cook": [
            "drained",
            "crust wanted",
            "steamed under a cloth"
          ],
          "region": [
            "Iran"
          ]
        },
        "note": "Two stages that most cuisines keep apart: boiled like pasta and drained while still firm, then piled back over butter and steamed dry under a cloth until a slab of tahdig forms underneath."
      },
      {
        "name": "Biryani",
        "facets": {
          "grain": [
            "long-grain",
            "basmati"
          ],
          "prep": [
            "washed",
            "soaked",
            "parboiled"
          ],
          "liquid": [
            "excess water",
            "whole spices in the water"
          ],
          "cook": [
            "drained",
            "layered with the masala",
            "sealed with dough",
            "steamed on low heat"
          ],
          "region": [
            "South Asia"
          ]
        },
        "note": "The argument with pulao is a method argument, not a spice one. Pulao cooks rice and meat together in one measured liquid; biryani cooks them separately and only then puts them in the same pot."
      },
      {
        "name": "Jollof rice",
        "facets": {
          "grain": [
            "long-grain",
            "factory-parboiled"
          ],
          "prep": [
            "washed"
          ],
          "liquid": [
            "measured liquid",
            "tomato and pepper stew"
          ],
          "cook": [
            "left alone",
            "lid on",
            "crust wanted",
            "sealed with foil"
          ],
          "region": [
            "West Africa"
          ]
        },
        "note": "The liquid is the entire dish. A reduced tomato-and-pepper base goes in as the cooking water, so nothing is seasoned afterwards; foil under the lid holds the steam in while the bottom is left to catch. Factory-parboiled long-grain is usual, because converted rice survives the braise without breaking."
      },
      {
        "name": "Thieboudienne",
        "facets": {
          "grain": [
            "broken rice"
          ],
          "prep": [
            "washed"
          ],
          "liquid": [
            "measured liquid",
            "the strained fish broth"
          ],
          "cook": [
            "left alone",
            "lid on",
            "crust wanted"
          ],
          "region": [
            "Senegal"
          ]
        },
        "note": "The dish jollof descends from, and not a version of it. Broken rice, the broth the fish and vegetables were cooked in, and the xoon underneath — the crust the cook keeps back for herself."
      },
      {
        "name": "Arroz con gandules",
        "facets": {
          "grain": [
            "medium-grain"
          ],
          "prep": [
            "washed",
            "turned in the sofrito"
          ],
          "liquid": [
            "measured liquid",
            "sofrito broth"
          ],
          "cook": [
            "left alone",
            "lid on",
            "crust wanted",
            "uncovered at first",
            "turned once"
          ],
          "region": [
            "Puerto Rico"
          ]
        },
        "note": "The lid stays off until the liquid is gone, then one turn of the spoon and it goes on and stays on while the bottom catches. The pegao is scraped up and fought over."
      },
      {
        "name": "Dolsot bibimbap",
        "facets": {
          "grain": [
            "short-grain japonica"
          ],
          "prep": [
            "washed",
            "soaked"
          ],
          "liquid": [
            "measured liquid",
            "water"
          ],
          "cook": [
            "left alone",
            "lid on",
            "crust wanted",
            "topped",
            "mixed at the table"
          ],
          "region": [
            "Korea"
          ]
        },
        "note": "Plain absorption rice, moved into a stone bowl hot enough to go on cooking after it leaves the fire. The base is left to scorch into nurungji on purpose, the toppings are laid on rather than cooked in, and the eater finishes the dish by stirring the whole bowl through its own crust."
      }
    ],
    "notes": [
      {
        "title": "On washing",
        "body": "Rinsing rice washes off loose surface starch, and that one decision splits the family in two. Where the ideal is separate grains — pilaf, biryani, chelow — the rice is washed, often soaked, and sometimes sealed in fat as well. Where the ideal is a bound, creamy dish — risotto, paella — it goes into the pan dry and unrinsed and the starch is kept and put to work. It is the same choice that separates a sauced pasta from a soup. Congee sits outside the split rather than proving it: it is washed like any other pot of rice, and its body comes from an hour of collapse rather than from anything left on the outside of the grain."
      },
      {
        "title": "On stirring",
        "body": "Risotto is stirred constantly so the grains abrade each other and give up starch. Plov is never stirred at all, so the grains swell whole and stay loose. Same pot, same heat, opposite instruction, and the reason is the same in both cases: agitation is how you decide whether the starch stays in the grain or ends up in the liquid."
      },
      {
        "title": "On the crust",
        "body": "Socarrat, tahdig, pegao, xoon, nurungji, the scorched bottom of party jollof, the lacquered base of Cantonese clay-pot rice. A great deal of the world cooks rice specifically so that some of it burns, and nowhere is this an accident. Whether the pot is left long enough to catch is a decision like any other, and in six rows of this table it is the point."
      },
      {
        "title": "On one word travelling",
        "body": "Pilaf, pilav, pulao, plov, polow, pilau, pelau: one word, Persian by the time it travelled, carried along trade routes from Anatolia to the Caribbean. What travelled with it was a method, not a menu — toast or coat the grain in fat, add a measured amount of liquid, cover it, and do not touch it again. The meat and the spices changed in every country it reached."
      }
    ],
    "sources": [
      {
        "label": "Pilaf (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Pilaf"
      },
      {
        "label": "Risotto",
        "url": "https://en.wikipedia.org/wiki/Risotto"
      },
      {
        "label": "Paella",
        "url": "https://en.wikipedia.org/wiki/Paella"
      },
      {
        "label": "Biryani",
        "url": "https://en.wikipedia.org/wiki/Biryani"
      },
      {
        "label": "Congee",
        "url": "https://en.wikipedia.org/wiki/Congee"
      },
      {
        "label": "Thieboudienne",
        "url": "https://en.wikipedia.org/wiki/Thieboudienne"
      },
      {
        "label": "Jollof rice",
        "url": "https://en.wikipedia.org/wiki/Jollof_rice"
      },
      {
        "label": "Uzbek plov",
        "url": "https://en.wikipedia.org/wiki/Uzbek_plov"
      },
      {
        "label": "Tahdig",
        "url": "https://en.wikipedia.org/wiki/Tahdig"
      },
      {
        "label": "Bibimbap",
        "url": "https://en.wikipedia.org/wiki/Bibimbap"
      },
      {
        "label": "Parboiled rice",
        "url": "https://en.wikipedia.org/wiki/Parboiled_rice"
      },
      {
        "label": "Around the World in Bottom Pot (Kitchen Butterfly)",
        "url": "https://www.kitchenbutterfly.com/2016/around-the-world-in-bottom-pot/"
      }
    ],
    "yours": [
      "rice",
      "risotto",
      "paella",
      "biryani",
      "pilaf",
      "pulao",
      "congee",
      "jollof",
      "bibimbap",
      "dolsot",
      "nasi",
      "arroz"
    ]
  },
  {
    "slug": "sausage",
    "name": "Sausage",
    "standfirst": "Ground meat and salt, and then one decision: cook it today, hang it in cold air until it keeps for a year, or chop it with ice until it sets like a custard under heat. Everything after that — the fennel, the harissa, the pimentón, the coriander and clove — is a region answering the same question about what to put in. Fresh chorizo and dry chorizo are not one sausage at two ages. They sit in different branches and share a name.",
    "root": "Ground meat and salt, worked cold until it binds",
    "facets": [
      {
        "id": "state",
        "label": "State"
      },
      {
        "id": "smoke",
        "label": "Smoke"
      },
      {
        "id": "grind",
        "label": "Grind"
      },
      {
        "id": "spice",
        "label": "Spice"
      },
      {
        "id": "region",
        "label": "Region"
      }
    ],
    "nestings": [
      {
        "label": "By state",
        "by": [
          "state",
          "smoke",
          "grind"
        ]
      },
      {
        "label": "By grind",
        "by": [
          "grind",
          "state"
        ]
      },
      {
        "label": "By region",
        "by": [
          "region",
          "state"
        ]
      }
    ],
    "dishes": [
      {
        "name": "Salsiccia",
        "facets": {
          "state": [
            "sold raw",
            "cooked by whoever buys it"
          ],
          "smoke": [
            "no smoke"
          ],
          "grind": [
            "coarse",
            "through a wide plate"
          ],
          "spice": [
            "fennel seed",
            "black pepper",
            "garlic"
          ],
          "region": [
            "Italy"
          ]
        },
        "note": "The plainest thing in the family and the reason it is the base: pork, salt, pepper and one aromatic. The fennel is doing what the coriander does in boerewors and the marjoram does in kiełbasa — it is the single seed a region agreed on."
      },
      {
        "name": "Cumberland",
        "facets": {
          "state": [
            "sold raw",
            "cooked by whoever buys it"
          ],
          "smoke": [
            "no smoke"
          ],
          "grind": [
            "coarse",
            "chopped rather than minced"
          ],
          "spice": [
            "black pepper",
            "white pepper",
            "nutmeg"
          ],
          "region": [
            "England"
          ]
        },
        "note": "Pepper-led rather than herb-led, which is unusual in England — Lincolnshire answers the same brief with sage. Traditional Cumberland holds a PGI, and part of what is protected is the shape: it is never twisted into links."
      },
      {
        "name": "Merguez",
        "facets": {
          "state": [
            "sold raw",
            "cooked by whoever buys it"
          ],
          "smoke": [
            "no smoke"
          ],
          "grind": [
            "fine",
            "through a narrow plate"
          ],
          "spice": [
            "chilli",
            "harissa",
            "cumin",
            "garlic"
          ],
          "region": [
            "Maghreb"
          ]
        },
        "note": "Lamb and beef rather than pork, so the whole family works where pork does not. The narrow lamb casing is the dish as much as the harissa: thin enough that it chars before the inside can dry, which is why merguez is grilled hot and eaten in three bites."
      },
      {
        "name": "Boerewors",
        "facets": {
          "state": [
            "sold raw",
            "cooked by whoever buys it"
          ],
          "smoke": [
            "no smoke"
          ],
          "grind": [
            "coarse",
            "chopped rather than minced",
            "fat kept under a third"
          ],
          "spice": [
            "coriander seed",
            "clove",
            "nutmeg",
            "brown vinegar"
          ],
          "region": [
            "South Africa"
          ]
        },
        "note": "The only sausage here with a legal recipe: South African regulation sets ninety per cent meat, thirty per cent fat at most, and no mechanically recovered meat. Toasted coriander is the signature, and the vinegar is a Cape spice-route habit rather than a preservative — it goes on the braai the same day."
      },
      {
        "name": "Chorizo fresco",
        "facets": {
          "state": [
            "sold raw",
            "cooked by whoever buys it"
          ],
          "smoke": [
            "no smoke"
          ],
          "grind": [
            "fine",
            "crumbles when it cooks"
          ],
          "spice": [
            "chilli",
            "guajillo",
            "vinegar",
            "Mexican oregano"
          ],
          "region": [
            "Mexico"
          ]
        },
        "note": "Not young Spanish chorizo. The pimentón was traded for guajillo and ancho, the vinegar was pushed up, and the drying step was dropped entirely — so it stays raw and is usually squeezed out of the casing into the pan."
      },
      {
        "name": "Longganisa",
        "facets": {
          "state": [
            "sold raw",
            "left to sour for a day or two"
          ],
          "smoke": [
            "no smoke"
          ],
          "grind": [
            "coarse",
            "fat left in visible pieces"
          ],
          "spice": [
            "garlic",
            "cane vinegar",
            "sugar in the hamonado camp"
          ],
          "region": [
            "Philippines"
          ]
        },
        "note": "Named from Spanish longaniza and then split in two by Filipino cooks: de recado, garlicky and sour, of which Vigan is the standard, against hamonado, sugared until it caramelises in the pan. The short links are hung a day or two first, which is a brief ferment — the only fresh sausage here that sours on purpose."
      },
      {
        "name": "Sai ua",
        "facets": {
          "state": [
            "sold raw",
            "cooked by whoever buys it"
          ],
          "smoke": [
            "no smoke"
          ],
          "grind": [
            "coarse",
            "hand-chopped"
          ],
          "spice": [
            "chilli",
            "lemongrass",
            "kaffir lime leaf",
            "turmeric"
          ],
          "region": [
            "Thailand",
            "Lanna north"
          ]
        },
        "note": "A curry paste used as a sausage seasoning: lemongrass, galangal, turmeric, kaffir lime and shallot pounded together, then worked through fatty pork. The seasoning is wet and fresh rather than dry and ground, which is exactly why it will not keep — it is coiled and grilled over coals the same day."
      },
      {
        "name": "Chorizo",
        "facets": {
          "state": [
            "hung until it keeps",
            "fermented first",
            "eaten without cooking"
          ],
          "smoke": [
            "no smoke",
            "smoke arrives in the pimentón"
          ],
          "grind": [
            "coarse",
            "fat cut into cubes"
          ],
          "spice": [
            "chilli",
            "pimentón",
            "garlic",
            "oregano"
          ],
          "region": [
            "Spain"
          ]
        },
        "note": "Most Spanish chorizo is never near a fire. The smoke you taste came in with the paprika, which was dried over oak in La Vera before it was ever ground — flavour bought in as an ingredient rather than made in the smokehouse. Asturias is the exception and smokes the sausage itself."
      },
      {
        "name": "Sucuk",
        "facets": {
          "state": [
            "hung until it keeps",
            "fermented first",
            "fried before eating"
          ],
          "smoke": [
            "no smoke"
          ],
          "grind": [
            "fine",
            "worked until it turns sticky"
          ],
          "spice": [
            "cumin",
            "fenugreek",
            "garlic",
            "red pepper flakes"
          ],
          "region": [
            "Turkey"
          ]
        },
        "note": "Beef, ten days to a fortnight of ferment, and then air. Dry-cured like chorizo but not eaten like it: sucuk goes in a cold pan and renders its own fat, so the drying is there to concentrate it rather than to make it ready."
      },
      {
        "name": "Lap cheong",
        "facets": {
          "state": [
            "hung until it keeps",
            "cured with sugar instead",
            "cooked before eating"
          ],
          "smoke": [
            "no smoke",
            "sun and wind instead"
          ],
          "grind": [
            "coarse",
            "lean and fat chopped separately"
          ],
          "spice": [
            "sugar",
            "light soy",
            "rose wine"
          ],
          "region": [
            "China",
            "Guangdong"
          ]
        },
        "note": "The one dried sausage here that does not ferment. Sugar and salt take the water out on their own, so nothing sours, and the result stays hard and sweet and has to be steamed over rice before it is food. Rose-scented mei kwei lu is the perfume that makes it recognisable across a room."
      },
      {
        "name": "'Nduja",
        "facets": {
          "state": [
            "hung until it keeps",
            "fermented first",
            "eaten without cooking"
          ],
          "smoke": [
            "cold-smoked",
            "over oak"
          ],
          "grind": [
            "fine",
            "ground twice",
            "worked to a paste"
          ],
          "spice": [
            "chilli",
            "peperoncino by the handful",
            "salt"
          ],
          "region": [
            "Italy",
            "Calabria"
          ]
        },
        "note": "A cured salame that never firms up, because roughly a quarter of it is chilli and most of the rest is soft fat. Spilinga is the town that owns it. It proves that curing and slicing are separable moves: this one cures for months and is still spread with a knife."
      },
      {
        "name": "Andouille",
        "facets": {
          "state": [
            "cooked in the making",
            "cooked through by the smoke"
          ],
          "smoke": [
            "hot-smoked",
            "over pecan",
            "twice"
          ],
          "grind": [
            "coarse",
            "cut in chunks by hand"
          ],
          "spice": [
            "garlic",
            "cayenne",
            "black pepper",
            "thyme"
          ],
          "region": [
            "United States",
            "Louisiana"
          ]
        },
        "note": "The only sausage here cooked by smoke alone — no water bath, no oven, just hours over pecan and sometimes sugarcane until it is done through and nearly dry at the edge. It shares a name with French andouille and almost nothing else, since the French one is made of tripe."
      },
      {
        "name": "Kiełbasa wiejska",
        "facets": {
          "state": [
            "cooked in the making",
            "scalded in hot water"
          ],
          "smoke": [
            "hot-smoked",
            "over alder"
          ],
          "grind": [
            "coarse",
            "some of it ground finer to bind"
          ],
          "spice": [
            "garlic",
            "marjoram",
            "black pepper"
          ],
          "region": [
            "Poland"
          ]
        },
        "note": "Marjoram and garlic are the whole seasoning, and the trick is in the grind: part of the meat is put through a fine plate and worked into a sticky paste that glues the coarse chunks together. Smoke first, then a gentle scald that finishes it without splitting the casing."
      },
      {
        "name": "Frankfurter",
        "facets": {
          "state": [
            "cooked in the making",
            "scalded in hot water"
          ],
          "smoke": [
            "cold-smoked",
            "over beech"
          ],
          "grind": [
            "emulsified",
            "chopped with ice to a paste",
            "no particle left visible"
          ],
          "spice": [
            "white pepper",
            "mace",
            "coriander seed"
          ],
          "region": [
            "Germany"
          ]
        },
        "note": "Frankfurt made it from pork in a sheep casing; Vienna answered with beef in the mix and called it a Wiener, and each city named its version after the other. The seasoning is deliberately quiet because there is no texture to compete with — an emulsion is uniform all the way through."
      },
      {
        "name": "Mortadella",
        "facets": {
          "state": [
            "cooked in the making",
            "steamed for hours"
          ],
          "smoke": [
            "no smoke"
          ],
          "grind": [
            "emulsified",
            "chopped with ice to a paste",
            "cubes of back fat folded back in"
          ],
          "spice": [
            "black pepper",
            "myrtle berries",
            "pistachio"
          ],
          "region": [
            "Italy",
            "Bologna"
          ]
        },
        "note": "The same emulsion as a frankfurter, with the fat put back by hand: cubes of neck fat folded into the paste so they stay whole and read as white polka dots. A large one steams in dry air for the better part of a day. The name may come from myrtle, which is still in the better recipes."
      },
      {
        "name": "Boudin noir",
        "facets": {
          "state": [
            "cooked in the making",
            "poached before it is sold"
          ],
          "smoke": [
            "no smoke"
          ],
          "grind": [
            "nothing minced",
            "diced back fat"
          ],
          "spice": [
            "onion",
            "quatre épices",
            "thyme"
          ],
          "region": [
            "France"
          ]
        },
        "note": "No grinder touches this one. Blood is already a liquid protein, so it sets by itself once it is poached — the sausage that needs no bind at all. Onions cooked down in fat carry the sweetness, and you fry it a second time at home until the skin blisters."
      }
    ],
    "notes": [
      {
        "title": "On what the salt is actually for",
        "body": "Salt here is structure, not seasoning. Above roughly two per cent it dissolves myosin out of the muscle fibres, and that dissolved protein is the glue holding one grain of meat to the next; without it a sausage is mince in a bag that falls apart in the pan. This is why every recipe in the family says work it cold and stop when it turns tacky. Let the fat climb past about fifteen degrees and it smears instead of staying in pieces, the bind breaks, and the sausage cooks out grey with a puddle of grease beside it. One rule, sixteen dishes."
      },
      {
        "title": "On the emulsion",
        "body": "Mortadella and the frankfurter are not fresh sausages ground finer. They are a different physical object: fat cut so small it is suspended in a gel of protein and water, chopped with ice so the bowl never warms, and the gel only sets when heat runs through it. That is the reason they cannot be sold raw — the sausage does not exist until it has been cooked. A fresh sausage is meat held together. An emulsion is meat taken apart and rebuilt, and the row of white cubes in a slice of mortadella is fat deliberately put back in afterwards, because otherwise there would be nothing to see."
      },
      {
        "title": "On the casing",
        "body": "The casing is the column that is not in the table, and it decides more than it looks. Merguez goes into a narrow lamb runner so it chars before the middle can dry. Cumberland is never linked at all — it reaches the pan as one coil pinned with a skewer, and the PGI protects that shape. Mortadella needs a casing as wide as a bladder because it has to steam for most of a day. And two dishes here prove the casing can be a mould rather than part of the dish: nduja is spread on bread and Mexican chorizo is squeezed into a hot pan, and neither is ever eaten in its skin."
      },
      {
        "title": "On two chorizos with one name",
        "body": "Spanish chorizo is fermented, hung for weeks and sliced cold. Mexican chorizo is raw, sharp with vinegar, and disintegrates in the pan on purpose. The second is not a younger version of the first: when the sausage crossed the Atlantic the pimentón was replaced by guajillo and ancho, the drying was abandoned, and only the name survived the trip. The table is full of the same trap. Longganisa took its name from Spanish longaniza and its garlic and cane vinegar from Ilocos. Cajun andouille shares a word with French andouille, which is made of tripe. And nduja, andouille and andouillette all descend from the same Latin inductilia — the word travelled much further than the recipe did."
      },
      {
        "title": "On blood",
        "body": "Blood is a whole branch sitting in one seat. Boudin noir stands here for morcilla de Burgos, which is bulked with rice; for Korean sundae, bulked with glass noodles; for black pudding with its oatmeal, for Polish kaszanka with its buckwheat, for German Blutwurst with neither. What separates them is not the blood, which behaves the same everywhere — it is the starch each region had to hand. They are siblings, and none of them is a version of any of the others."
      },
      {
        "title": "On depth",
        "body": "Nothing in this table is nested under anything else, and that is a claim rather than laziness. Real lineage exists in sausage, but it mostly runs out of the table: droëwors is boerewors hung until dry, chorizo fresco is a fork from Spanish chorizo rather than a stage of it, the Wiener and the Frankfurter are two cities arguing over one object. Sixteen traditions solving the problem of meat, salt and time are siblings at the same depth. Arranging them into a lineage would make the picture tidier and the claim false."
      }
    ],
    "sources": [
      {
        "label": "Sausage (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Sausage"
      },
      {
        "label": "Boerewors",
        "url": "https://en.wikipedia.org/wiki/Boerewors"
      },
      {
        "label": "Merguez",
        "url": "https://en.wikipedia.org/wiki/Merguez"
      },
      {
        "label": "Chorizo",
        "url": "https://en.wikipedia.org/wiki/Chorizo"
      },
      {
        "label": "'Nduja",
        "url": "https://en.wikipedia.org/wiki/'Nduja"
      },
      {
        "label": "Mortadella",
        "url": "https://en.wikipedia.org/wiki/Mortadella"
      },
      {
        "label": "Chinese sausage",
        "url": "https://en.wikipedia.org/wiki/Chinese_sausage"
      },
      {
        "label": "Longganisa",
        "url": "https://en.wikipedia.org/wiki/Longaniza"
      },
      {
        "label": "Andouille",
        "url": "https://en.wikipedia.org/wiki/Andouille"
      },
      {
        "label": "Sai oua",
        "url": "https://en.wikipedia.org/wiki/Sai_oua"
      },
      {
        "label": "Sujuk",
        "url": "https://en.wikipedia.org/wiki/Sujuk"
      },
      {
        "label": "Kielbasa",
        "url": "https://en.wikipedia.org/wiki/Kielbasa"
      },
      {
        "label": "Blood sausage",
        "url": "https://en.wikipedia.org/wiki/Blood_sausage"
      },
      {
        "label": "Cumberland sausage",
        "url": "https://en.wikipedia.org/wiki/Cumberland_sausage"
      },
      {
        "label": "Frankfurter Würstchen",
        "url": "https://en.wikipedia.org/wiki/Frankfurter_W%C3%BCrstchen"
      }
    ],
    "yours": [
      "sausage",
      "salsiccia",
      "chorizo",
      "merguez",
      "boerewors",
      "nduja",
      "mortadella",
      "kielbasa",
      "longganisa",
      "andouille",
      "blood sausage",
      "black pudding",
      "lap cheong",
      "hot dog"
    ]
  },
  {
    "slug": "skewer",
    "name": "Food on a skewer",
    "standfirst": "A stick does two things a grill cannot: it turns a handful of small pieces as one, and it holds them at a fixed distance from the coals. Nearly every fire-using culture worked this out independently, which is why the family is enormous and the differences between its members are narrow — what goes on the meat before the fire, what the fire is made of, and whether the sauce arrives during the cooking or after it.",
    "root": "Small pieces of food threaded onto a stick and cooked over fire",
    "facets": [
      {
        "id": "thread",
        "label": "On the stick"
      },
      {
        "id": "prep",
        "label": "Before the fire"
      },
      {
        "id": "fire",
        "label": "Fire"
      },
      {
        "id": "sauce",
        "label": "Sauce"
      },
      {
        "id": "region",
        "label": "Region"
      }
    ],
    "nestings": [
      {
        "label": "By marinade",
        "by": [
          "prep",
          "sauce",
          "fire"
        ]
      },
      {
        "label": "By fire",
        "by": [
          "fire",
          "thread"
        ]
      },
      {
        "label": "By when the sauce arrives",
        "by": [
          "sauce",
          "prep"
        ]
      },
      {
        "label": "By region",
        "by": [
          "region",
          "prep"
        ]
      }
    ],
    "dishes": [
      {
        "name": "Yakitori",
        "facets": {
          "thread": [
            "cubes of meat",
            "chicken thigh",
            "spring onion between",
            "thin bamboo"
          ],
          "prep": [
            "no marinade",
            "raw onto the stick"
          ],
          "fire": [
            "charcoal",
            "narrow trough grill",
            "binchōtan"
          ],
          "sauce": [
            "during the cooking",
            "dipped in tare",
            "dipped again between turns"
          ],
          "region": [
            "Japan"
          ]
        },
        "note": "Nothing goes on the chicken beforehand. The flavour is built in layers on the grill — dip, cook, dip again — so the saucing and the cooking are the same act."
      },
      {
        "name": "Satay",
        "facets": {
          "thread": [
            "cubes of meat",
            "chicken",
            "thin bamboo"
          ],
          "prep": [
            "wet marinade",
            "turmeric",
            "lemongrass",
            "palm sugar"
          ],
          "fire": [
            "charcoal",
            "open grill",
            "coconut shell",
            "fanned by hand"
          ],
          "sauce": [
            "after the cooking",
            "peanut sauce alongside"
          ],
          "region": [
            "Indonesia",
            "Malaysia"
          ]
        },
        "note": "The opposite pole from yakitori: everything happens before the fire or after it. The peanut sauce never touches the coals."
      },
      {
        "name": "Souvlaki",
        "facets": {
          "thread": [
            "cubes of meat",
            "pork",
            "thin bamboo"
          ],
          "prep": [
            "wet marinade",
            "olive oil",
            "lemon",
            "oregano"
          ],
          "fire": [
            "charcoal",
            "open grill"
          ],
          "sauce": [
            "after the cooking",
            "tzatziki alongside"
          ],
          "region": [
            "Greece"
          ]
        }
      },
      {
        "name": "Shish taouk",
        "facets": {
          "thread": [
            "cubes of meat",
            "chicken breast",
            "flat metal skewer"
          ],
          "prep": [
            "wet marinade",
            "yoghurt",
            "garlic",
            "lemon"
          ],
          "fire": [
            "charcoal",
            "open grill"
          ],
          "sauce": [
            "after the cooking",
            "toum alongside"
          ],
          "region": [
            "Lebanon"
          ]
        },
        "note": "The same yoghurt marinade as chicken tikka, taken to an open grill instead of a clay oven. The garlic arrives twice — in the marinade, then whipped with oil as toum at the table."
      },
      {
        "name": "Şiş kebap",
        "facets": {
          "thread": [
            "cubes of meat",
            "lamb",
            "tail fat between",
            "flat metal skewer"
          ],
          "prep": [
            "wet marinade",
            "olive oil",
            "onion juice",
            "pepper paste"
          ],
          "fire": [
            "charcoal",
            "mangal",
            "skewers on rails"
          ],
          "sauce": [
            "after the cooking",
            "sumac onion alongside"
          ],
          "region": [
            "Turkey"
          ]
        }
      },
      {
        "name": "Shashlik",
        "facets": {
          "thread": [
            "cubes of meat",
            "lamb",
            "onion between",
            "long metal shampur"
          ],
          "prep": [
            "wet marinade",
            "vinegar",
            "raw onion",
            "overnight"
          ],
          "fire": [
            "wood embers",
            "mangal",
            "no flame"
          ],
          "sauce": [
            "after the cooking",
            "tkemali alongside"
          ],
          "region": [
            "Caucasus",
            "Russia"
          ]
        },
        "note": "The acid does the work. A night in vinegar and onion is a tenderiser as much as a seasoning, which is why the meat can be older and the fire brisk."
      },
      {
        "name": "Adana kebabı",
        "facets": {
          "thread": [
            "ground meat",
            "hand-minced lamb",
            "tail fat",
            "pressed onto a flat blade"
          ],
          "prep": [
            "seasoned into the mince",
            "hot red pepper",
            "salt"
          ],
          "fire": [
            "charcoal",
            "mangal",
            "skewers on rails",
            "turned constantly"
          ],
          "sauce": [
            "after the cooking",
            "sumac onion alongside",
            "butter into the flatbread"
          ],
          "region": [
            "Turkey"
          ]
        },
        "note": "The flat blade is not decoration. Ground meat spins loose on a round rod and drops into the fire; a wide blade grips it."
      },
      {
        "name": "Kabab kubideh",
        "facets": {
          "thread": [
            "ground meat",
            "minced lamb",
            "pressed onto a flat blade"
          ],
          "prep": [
            "seasoned into the mince",
            "grated onion",
            "turmeric",
            "salt"
          ],
          "fire": [
            "charcoal",
            "mangal",
            "skewers on rails",
            "turned constantly"
          ],
          "sauce": [
            "after the cooking",
            "grilled tomato alongside",
            "butter into the rice"
          ],
          "region": [
            "Iran"
          ]
        },
        "note": "The same loose mince on the same wide blade as Adana, seasoned the other way — grated onion and turmeric rather than hot pepper, and the onion's water is what makes the mince grip. The tomato goes on a skewer of its own, and the butter goes into rice rather than into bread."
      },
      {
        "name": "Seekh kebab",
        "facets": {
          "thread": [
            "ground meat",
            "minced lamb",
            "pressed onto a metal rod"
          ],
          "prep": [
            "seasoned into the mince",
            "ginger",
            "garlic",
            "garam masala"
          ],
          "fire": [
            "clay oven",
            "tandoor",
            "hung vertically"
          ],
          "sauce": [
            "after the cooking",
            "green chutney alongside"
          ],
          "region": [
            "South Asia"
          ]
        },
        "note": "Same ground-meat problem as Adana and kubideh, solved in a vertical oven instead of over an open trough — so the mince has to bind well enough to hang."
      },
      {
        "name": "Chicken tikka",
        "facets": {
          "thread": [
            "cubes of meat",
            "boneless chicken",
            "long metal rod"
          ],
          "prep": [
            "wet marinade",
            "yoghurt",
            "Kashmiri chilli",
            "ginger"
          ],
          "fire": [
            "clay oven",
            "tandoor",
            "hung vertically"
          ],
          "sauce": [
            "during the cooking",
            "brushed with ghee"
          ],
          "region": [
            "Punjab"
          ]
        },
        "note": "Yoghurt is the marinade that clings. It holds spice against the meat in a fire hot enough to burn a thin oil marinade straight off."
      },
      {
        "name": "Chuanr",
        "facets": {
          "thread": [
            "cubes of meat",
            "lamb",
            "fat between",
            "flat metal skewer"
          ],
          "prep": [
            "no marinade",
            "salted"
          ],
          "fire": [
            "charcoal",
            "narrow trough grill",
            "skewers on rails"
          ],
          "sauce": [
            "during the cooking",
            "cumin dusted on",
            "chilli flakes dusted on"
          ],
          "region": [
            "Xinjiang",
            "China"
          ]
        },
        "note": "Seasoning arrives as dust on the fire rather than as a soak beforehand — the cumin that misses the meat hits the coals and comes back as smoke."
      },
      {
        "name": "Anticucho",
        "facets": {
          "thread": [
            "cubes of offal",
            "beef heart",
            "thin bamboo"
          ],
          "prep": [
            "wet marinade",
            "ají panca",
            "red wine vinegar",
            "cumin"
          ],
          "fire": [
            "charcoal",
            "open grill",
            "street brazier"
          ],
          "sauce": [
            "during the cooking",
            "basted with the marinade",
            "ají alongside"
          ],
          "region": [
            "Peru"
          ]
        },
        "note": "The cheapest cut in the family, and the one that most needs the acid. Heart is lean and firm; the vinegar marinade is doing structural work before it is doing flavour."
      },
      {
        "name": "Picanha no espeto",
        "facets": {
          "thread": [
            "whole cuts",
            "picanha",
            "folded onto a sword skewer"
          ],
          "prep": [
            "no marinade",
            "salted",
            "coarse"
          ],
          "fire": [
            "wood embers",
            "open pit",
            "turned slowly"
          ],
          "sauce": [
            "after the cooking",
            "vinagrete alongside"
          ],
          "region": [
            "Brazil"
          ]
        },
        "note": "Churrasco names Brazil's whole fire tradition rather than any one dish, so the skewer form has to be named for the cut. The only one here not cut down to a bite: a folded whole cut is sliced off as its outside browns and the rest goes back to the fire."
      },
      {
        "name": "Sosatie",
        "facets": {
          "thread": [
            "cubes of meat",
            "lamb",
            "dried apricot between",
            "thin bamboo"
          ],
          "prep": [
            "wet marinade",
            "curry powder",
            "apricot jam",
            "overnight"
          ],
          "fire": [
            "wood embers",
            "braai",
            "moderate heat"
          ],
          "sauce": [
            "during the cooking",
            "basted with the boiled marinade"
          ],
          "region": [
            "South Africa"
          ]
        },
        "note": "The name descends from sate by way of the Cape's Malay kitchens. The marinade is boiled down afterwards and becomes the basting sauce — one liquid doing both jobs."
      },
      {
        "name": "Suya",
        "facets": {
          "thread": [
            "strips of meat",
            "beef",
            "flat wooden skewer"
          ],
          "prep": [
            "dry rub",
            "yaji",
            "ground peanut",
            "cayenne"
          ],
          "fire": [
            "wood embers",
            "open grill",
            "skewers leaned around the fire"
          ],
          "sauce": [
            "during the cooking",
            "yaji dusted on",
            "yaji dusted again after"
          ],
          "region": [
            "Nigeria"
          ]
        },
        "note": "The same spice three times — rubbed in before the fire, thrown on during it, dusted over at the table. Thin strips exist so the rub has more surface to sit on."
      },
      {
        "name": "Arrosticini",
        "facets": {
          "thread": [
            "cubes of meat",
            "castrato mutton",
            "fat between",
            "thin bamboo"
          ],
          "prep": [
            "no marinade",
            "salted",
            "at the fire"
          ],
          "fire": [
            "charcoal",
            "narrow trough grill",
            "turned by hand"
          ],
          "sauce": [
            "none"
          ],
          "region": [
            "Abruzzo"
          ]
        },
        "note": "The floor of the family. No marinade and no sauce — the whole dish is sheep fat rendering onto charcoal at the distance the trough fixes for you."
      },
      {
        "name": "Espetada",
        "facets": {
          "thread": [
            "cubes of meat",
            "beef",
            "bay laurel stick"
          ],
          "prep": [
            "dry rub",
            "salted",
            "coarse",
            "crushed garlic",
            "bay leaf"
          ],
          "fire": [
            "wood embers",
            "open grill",
            "no flame"
          ],
          "sauce": [
            "during the cooking",
            "garlic butter dripped over"
          ],
          "region": [
            "Madeira"
          ]
        },
        "note": "Here the skewer is an ingredient. A green laurel branch heats through and pushes its oil into the meat from the inside out."
      },
      {
        "name": "Brochette",
        "facets": {
          "thread": [
            "cubes of meat",
            "beef",
            "vegetables between",
            "metal skewer"
          ],
          "prep": [
            "wet marinade",
            "oil",
            "thyme",
            "black pepper"
          ],
          "fire": [
            "gas",
            "overhead grill"
          ],
          "sauce": [
            "after the cooking",
            "herb butter alongside"
          ],
          "region": [
            "France"
          ]
        },
        "note": "The word is only French for skewer, which is how a generic became a dish name. It is also the one here that need not meet live fire at all."
      }
    ],
    "notes": [
      {
        "title": "On what the stick is actually for",
        "body": "Two jobs, and the second is the one people forget. A skewer makes a handful of small pieces turnable as a single object, and it fixes their height above the coals. That second job is why the narrow trough grill keeps being reinvented — the Japanese konro, the Xinjiang charcoal channel and the Abruzzese canala are the same idea three times over: a gutter exactly as wide as the skewers, so the meat sits over the fire and the wood sits off it."
      },
      {
        "title": "On during or after",
        "body": "Sauce during the cooking is a construction method. Tare, a boiled-down sosatie marinade and an anticucho basting all carry sugar, which browns beautifully and then burns, so they go on late and in thin coats and the skewer goes back for another. Sauce after the cooking leaves the char alone and hands the seasoning to the eater — satay's peanut sauce is not grill flavour at all, it is a second dish served against the first. Suya is the family's answer to why choose: yaji before, yaji during, yaji again at the table."
      },
      {
        "title": "On calling it all kebab",
        "body": "Yakitori is not a Japanese kebab and anticucho is not a Peruvian one. These are separate answers to the same problem, reached by people who had a fire, a knife and something small to cook, and each tradition named its own. That is why nothing here is nested under anything else."
      }
    ],
    "sources": [
      {
        "label": "Yakitori",
        "url": "https://en.wikipedia.org/wiki/Yakitori"
      },
      {
        "label": "Satay",
        "url": "https://en.wikipedia.org/wiki/Satay"
      },
      {
        "label": "Shish taouk",
        "url": "https://en.wikipedia.org/wiki/Shish_taouk"
      },
      {
        "label": "Kabab kubideh",
        "url": "https://en.wikipedia.org/wiki/Kabab_koobideh"
      },
      {
        "label": "Sosatie",
        "url": "https://en.wikipedia.org/wiki/Sosatie"
      },
      {
        "label": "Espetada",
        "url": "https://en.wikipedia.org/wiki/Espetada"
      },
      {
        "label": "Arrosticini",
        "url": "https://en.wikipedia.org/wiki/Arrosticini"
      },
      {
        "label": "Suya",
        "url": "https://en.wikipedia.org/wiki/Suya"
      },
      {
        "label": "Anticucho",
        "url": "https://en.wikipedia.org/wiki/Anticucho"
      },
      {
        "label": "Adana kebabı",
        "url": "https://en.wikipedia.org/wiki/Adana_kebab%C4%B1"
      },
      {
        "label": "Picanha",
        "url": "https://en.wikipedia.org/wiki/Picanha"
      }
    ],
    "yours": [
      "kebab",
      "skewer",
      "satay",
      "yakitori",
      "souvlaki",
      "brochette",
      "tikka",
      "anticucho",
      "grilled lamb"
    ]
  },
  {
    "slug": "soup",
    "name": "Soup",
    "standfirst": "Water, something to flavour it, and one decision that splits the family before any other: whether you can see through it. Consommé spends an entire technique taking things out until nothing is left but flavour. Egusi spends its technique on ground seed until the bowl is thick enough to eat with your hands. After that it is only ever three more questions — what does the thickening, whether it arrives hot or cold, and whether it opens the meal or is the meal. None of these is a version of any other.",
    "root": "Water, something to flavour it, and heat — where the liquid is the dish",
    "facets": [
      {
        "id": "base",
        "label": "Base"
      },
      {
        "id": "body",
        "label": "Body"
      },
      {
        "id": "served",
        "label": "Served"
      },
      {
        "id": "role",
        "label": "Role"
      },
      {
        "id": "region",
        "label": "Region"
      }
    ],
    "nestings": [
      {
        "label": "By body",
        "by": [
          "body",
          "served",
          "base"
        ]
      },
      {
        "label": "By what it is for",
        "by": [
          "role",
          "served",
          "body"
        ]
      },
      {
        "label": "By region",
        "by": [
          "region",
          "body"
        ]
      }
    ],
    "dishes": [
      {
        "name": "Consommé",
        "facets": {
          "base": [
            "meat stock",
            "beef shin",
            "aromatic vegetables"
          ],
          "body": [
            "clear",
            "clarified with an egg-white raft"
          ],
          "served": [
            "hot"
          ],
          "role": [
            "a starter"
          ],
          "region": [
            "France"
          ]
        },
        "note": "The only dish here whose whole technique is subtraction. A raft of egg white and minced meat rises through the stock and takes every particle with it; what is left has all the flavour and nothing to carry it."
      },
      {
        "name": "Miso shiru",
        "facets": {
          "base": [
            "dashi",
            "kombu",
            "katsuobushi"
          ],
          "body": [
            "clear",
            "clouded by miso in suspension"
          ],
          "served": [
            "hot"
          ],
          "role": [
            "part of the meal",
            "alongside rice"
          ],
          "region": [
            "Japan"
          ]
        },
        "note": "The miso is whisked in off the boil and never simmered — heat it and the aroma and the live culture go together. Not a course but one of several bowls that arrive at once."
      },
      {
        "name": "Tom yum",
        "facets": {
          "base": [
            "shellfish stock",
            "prawn heads",
            "galangal",
            "soured with lime juice"
          ],
          "body": [
            "clear",
            "slicked with chilli jam"
          ],
          "served": [
            "hot"
          ],
          "role": [
            "part of the meal",
            "alongside rice"
          ],
          "region": [
            "Thailand"
          ]
        },
        "note": "Clear in its older reading — nam sai — where sour and heat do the work a thickener does elsewhere. The orange on top is fat from chilli jam and not body."
      },
      {
        "name": "Sinigang",
        "facets": {
          "base": [
            "meat stock",
            "pork belly",
            "soured with tamarind"
          ],
          "body": [
            "clear",
            "left unthickened"
          ],
          "served": [
            "hot"
          ],
          "role": [
            "part of the meal",
            "alongside rice"
          ],
          "region": [
            "Philippines"
          ]
        },
        "note": "Sourness is the structure, not a seasoning: tamarind most often, but guava, green mango or kamias depending on the house and the month. A sour broth first and a pork dish second."
      },
      {
        "name": "Sopa de lima",
        "facets": {
          "base": [
            "meat stock",
            "chicken",
            "soured with lima agria"
          ],
          "body": [
            "clear",
            "left unthickened"
          ],
          "served": [
            "hot",
            "tortilla strips added at the table"
          ],
          "role": [
            "a starter"
          ],
          "region": [
            "Mexico",
            "Yucatán"
          ]
        },
        "note": "The lima agria is floral and faintly bitter rather than sharp, which is why a Persian lime does not stand in cleanly. The fried tortilla goes in a few strips at a time so it never has time to soften."
      },
      {
        "name": "Avgolemono",
        "facets": {
          "base": [
            "meat stock",
            "chicken",
            "rice"
          ],
          "body": [
            "thickened",
            "egg beaten with lemon"
          ],
          "served": [
            "hot"
          ],
          "role": [
            "a starter"
          ],
          "region": [
            "Greece"
          ]
        },
        "note": "The thickener is a sauce in its own right: eggs and lemon whisked together, tempered with hot broth, returned off the heat. Let it boil and it scrambles, and there is no recovering it."
      },
      {
        "name": "Harira",
        "facets": {
          "base": [
            "meat stock",
            "lamb",
            "tomato"
          ],
          "body": [
            "thickened",
            "lentils and chickpeas",
            "a flour-and-water tadouira poured in at the end"
          ],
          "served": [
            "hot"
          ],
          "role": [
            "the meal",
            "eaten to break the fast"
          ],
          "region": [
            "Morocco"
          ]
        },
        "note": "Harira means silk, and the tadouira is what earns the name — flour whisked cold into water and streamed into the simmering pot. The pulses have already done half the thickening before it arrives."
      },
      {
        "name": "Minestrone",
        "facets": {
          "base": [
            "vegetable water",
            "soffritto",
            "parmesan rind"
          ],
          "body": [
            "thickened",
            "beans cooked to collapse",
            "starch from the pasta"
          ],
          "served": [
            "hot"
          ],
          "role": [
            "the meal"
          ],
          "region": [
            "Italy"
          ]
        },
        "note": "There is no recipe, only a season. Cook whatever the garden has for long enough and the beans fall apart and the pasta gives up its starch: the soup thickens itself and nothing is added to make it do so."
      },
      {
        "name": "Borscht",
        "facets": {
          "base": [
            "meat stock",
            "beetroot",
            "soured with fermented beet kvas"
          ],
          "body": [
            "thickened",
            "grated root vegetables",
            "potato"
          ],
          "served": [
            "hot",
            "smetana stirred in at the table"
          ],
          "role": [
            "the meal"
          ],
          "region": [
            "Ukraine"
          ]
        },
        "note": "The sour is the point and traditionally it is not vinegar but beet kvas, fermented weeks ahead. The smetana goes in at the table, so the last decision about the bowl belongs to whoever is eating it."
      },
      {
        "name": "Dal",
        "facets": {
          "base": [
            "pulses and water",
            "split lentils",
            "turmeric"
          ],
          "body": [
            "thickened",
            "the pulses cooked to collapse"
          ],
          "served": [
            "hot",
            "a tarka poured over at the end"
          ],
          "role": [
            "part of the meal",
            "alongside rice"
          ],
          "region": [
            "India"
          ]
        },
        "note": "The pulses are the liquid and the thickener in one — nothing is added to bind it. The tarka arrives last: whole spices bloomed in hot fat and tipped over the surface still crackling."
      },
      {
        "name": "Egusi soup",
        "facets": {
          "base": [
            "meat stock",
            "palm oil",
            "smoked fish"
          ],
          "body": [
            "thickened",
            "ground melon seed"
          ],
          "served": [
            "hot"
          ],
          "role": [
            "the meal",
            "scooped up with pounded yam"
          ],
          "region": [
            "Nigeria"
          ]
        },
        "note": "Thick enough to be a sauce and eaten as one: a ball of swallow is dipped into it rather than a spoon lifted out of it. The ground seed thickens and enriches in a single move, which is what oil and flour do separately elsewhere."
      },
      {
        "name": "Clam chowder",
        "facets": {
          "base": [
            "shellfish stock",
            "clam liquor",
            "milk"
          ],
          "body": [
            "thickened",
            "a flour roux",
            "potato"
          ],
          "served": [
            "hot",
            "crackers crushed in at the table"
          ],
          "role": [
            "the meal"
          ],
          "region": [
            "United States",
            "New England"
          ]
        },
        "note": "Three thickeners for one bowl — roux, potato starch and the crackers the eater adds — which is exactly why the argument about how thick it should be has never been settled."
      },
      {
        "name": "Ajiaco",
        "facets": {
          "base": [
            "meat stock",
            "chicken",
            "guascas"
          ],
          "body": [
            "thickened",
            "papa criolla dissolving into it"
          ],
          "served": [
            "hot",
            "cream and capers added at the table"
          ],
          "role": [
            "the meal"
          ],
          "region": [
            "Colombia",
            "Bogotá"
          ]
        },
        "note": "Three potatoes doing three jobs: papa criolla falls apart and thickens the pot while pastusa and sabanera hold their shape. Without guascas this is chicken and potato soup with a different name."
      },
      {
        "name": "Gazpacho",
        "facets": {
          "base": [
            "raw vegetables",
            "tomato",
            "soured with sherry vinegar"
          ],
          "body": [
            "thickened",
            "stale bread",
            "olive oil emulsified in"
          ],
          "served": [
            "cold"
          ],
          "role": [
            "a starter"
          ],
          "region": [
            "Spain",
            "Andalusia"
          ]
        },
        "note": "Nothing is cooked at any point. Bread and oil do the thickening and the vinegar does the seasoning; the tomato is the newcomer, and the older Andalusian gazpachos are white and contain none."
      },
      {
        "name": "Potage parmentier",
        "facets": {
          "base": [
            "vegetable water",
            "leek",
            "potato"
          ],
          "body": [
            "thickened",
            "the vegetables puréed"
          ],
          "served": [
            "hot"
          ],
          "role": [
            "a starter"
          ],
          "region": [
            "France"
          ]
        },
        "note": "The plainest thickening available: cook a starchy vegetable in its own liquid until it will go through a sieve. Leek and potato need nothing added to hold the soup together."
      },
      {
        "name": "Vichyssoise",
        "parent": "Potage parmentier",
        "facets": {
          "base": [
            "vegetable water",
            "leek",
            "potato"
          ],
          "body": [
            "thickened",
            "the vegetables puréed",
            "cream"
          ],
          "served": [
            "cold"
          ],
          "role": [
            "a starter"
          ],
          "region": [
            "France",
            "New York"
          ]
        },
        "note": "Parmentier sieved finer, enriched with cream and chilled — put together in a New York hotel by a French chef remembering the soup his mother cooled with milk. It genuinely descends from parmentier; nothing else in this table descends from anything."
      }
    ],
    "notes": [
      {
        "title": "On clear and thick",
        "body": "The family forks once, early, and everything else follows: can you see through it. Clear is the expensive answer. Consommé spends hours and a raft of egg white removing solids that were already in the pot, and tom yum and sinigang get their weight from acid and heat because nothing has been added to give them any. Thick is the domestic answer, and almost always the answer given by a soup that has to be the whole meal — something in the bowl is asked to fall apart."
      },
      {
        "title": "On what does the thickening",
        "body": "Ground melon seed, collapsed lentils, stale bread, a flour slurry whisked in at the end, an egg beaten with lemon, a potato chosen because it disintegrates, a roux, the starch shed by pasta. Only two bowls here reach for flour as flour — harira's tadouira and the roux in a chowder. Everywhere else the thickener is something that was going in anyway and is simply cooked past the point where it keeps its shape. That is the whole trick, and it is why most of these soups have no thickening step you could point at in the method."
      },
      {
        "title": "On cold",
        "body": "Two bowls here are cold, and neither is a hot soup that was left to cool. Chilling flattens salt and mutes aroma, so a cold soup is seasoned harder and carries more acid and more fat than the same bowl would hot. Gazpacho was never heated at all and is built around vinegar and olive oil. Vichyssoise is parmentier deliberately rebalanced for the cold with cream and a finer sieve. Chill an ordinary leek and potato soup and you get neither of them — you get an underseasoned one."
      },
      {
        "title": "On starter or meal",
        "body": "Whether soup opens the meal or is the meal is a fact about the table, not about the soup. The French order that puts it first is a nineteenth-century service convention, and it does not travel: dal and miso shiru are neither starter nor meal but one component of a set, arriving with everything else and eaten in alternation with rice. Egusi is thick enough to be a sauce and is eaten with the hands by way of a swallow. Harira opens a meal and is substantial enough to end one. The same pot changes category by crossing a border."
      },
      {
        "title": "On what is not here",
        "body": "Noodle soups have their own family, because a noodle changes what the broth is for — it stops being the dish and becomes the medium for something else, and every decision reorganises around the noodle. At the other edge, when the liquid is only what the solid parts are sitting in, you have left soup and arrived at stew. The test both ways is the same: whether the liquid is the thing you came for."
      }
    ],
    "sources": [
      {
        "label": "Consommé (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Consomm%C3%A9"
      },
      {
        "label": "Culture of Ukrainian borscht cooking (UNESCO)",
        "url": "https://ich.unesco.org/en/USL/culture-of-ukrainian-borscht-cooking-01852"
      },
      {
        "label": "Harira (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Harira"
      },
      {
        "label": "Tom yum (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Tom_yum"
      },
      {
        "label": "Sinigang (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Sinigang"
      },
      {
        "label": "Egusi (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Egusi"
      },
      {
        "label": "Gazpacho (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Gazpacho"
      },
      {
        "label": "Vichyssoise (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Vichyssoise"
      },
      {
        "label": "Ajiaco (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Ajiaco"
      },
      {
        "label": "Clam chowder (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Clam_chowder"
      },
      {
        "label": "Avgolemono (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Avgolemono"
      },
      {
        "label": "Sopa de lima (MexConnect)",
        "url": "https://www.mexconnect.com/articles/2278-yucatecan-lime-soup-sopa-de-lima/"
      }
    ],
    "yours": [
      "soup",
      "broth",
      "consommé",
      "minestrone",
      "borscht",
      "miso",
      "tom yum",
      "gazpacho",
      "avgolemono",
      "harira",
      "chowder",
      "dal",
      "egusi",
      "ajiaco",
      "sinigang",
      "vichyssoise",
      "potage"
    ]
  },
  {
    "slug": "tomato-sauce",
    "name": "Tomato sauce",
    "standfirst": "One base — tomato, garlic, onion and basil softened in olive oil — and a short list of additions, each of which lands you somewhere with its own name.",
    "root": "Tomato · garlic · onion · basil, softened in olive oil",
    "facets": [
      {
        "id": "add",
        "label": "Added"
      },
      {
        "id": "fat",
        "label": "Fat"
      },
      {
        "id": "method",
        "label": "Method"
      },
      {
        "id": "region",
        "label": "Region"
      }
    ],
    "nestings": [
      {
        "label": "By addition",
        "by": [
          "add",
          "method"
        ]
      }
    ],
    "dishes": [
      {
        "name": "Rosa",
        "facets": {
          "region": [
            "Italy"
          ],
          "add": [
            "cream"
          ],
          "fat": [
            "olive oil"
          ],
          "method": [
            "reduced"
          ]
        }
      },
      {
        "name": "Vodka",
        "parent": "Rosa",
        "facets": {
          "region": [
            "Italy / United States"
          ],
          "add": [
            "cream",
            "vodka"
          ],
          "fat": [
            "pancetta"
          ],
          "method": [
            "reduced"
          ]
        },
        "note": "Rosa with vodka and pancetta — it descends from rosa, not from the base."
      },
      {
        "name": "Amatriciana",
        "facets": {
          "region": [
            "Lazio"
          ],
          "add": [
            "pecorino"
          ],
          "fat": [
            "guanciale"
          ],
          "method": [
            "rendered first"
          ]
        }
      },
      {
        "name": "Arrabbiata",
        "facets": {
          "region": [
            "Lazio"
          ],
          "add": [
            "dried chilli"
          ],
          "fat": [
            "olive oil"
          ],
          "method": [
            "reduced"
          ]
        }
      },
      {
        "name": "Puttanesca",
        "facets": {
          "region": [
            "Campania"
          ],
          "add": [
            "olives",
            "capers",
            "anchovy"
          ],
          "fat": [
            "olive oil"
          ],
          "method": [
            "reduced"
          ]
        }
      },
      {
        "name": "alla Norma",
        "facets": {
          "region": [
            "Sicily"
          ],
          "add": [
            "ricotta salata"
          ],
          "fat": [
            "olive oil"
          ],
          "method": [
            "fried eggplant folded in"
          ]
        }
      }
    ],
    "notes": [
      {
        "title": "On depth",
        "body": "Only vodka sits a level down, because it is genuinely rosa plus two things. The other five are each one move from the base and belong at the same depth — arranging them otherwise makes the picture tidier and the claim false."
      }
    ],
    "sources": [
      {
        "label": "Tomato sauce (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Tomato_sauce"
      },
      {
        "label": "Amatriciana",
        "url": "https://en.wikipedia.org/wiki/Sugo_all%27amatriciana"
      },
      {
        "label": "Pasta alla Norma",
        "url": "https://en.wikipedia.org/wiki/Pasta_alla_Norma"
      }
    ],
    "yours": [
      "tomato sauce",
      "marinara",
      "arrabbiata",
      "vodka sauce",
      "puttanesca",
      "sugo"
    ]
  },
  {
    "slug": "wrapped-parcel",
    "name": "Wrapped in a leaf",
    "standfirst": "A leaf is the oldest cooking vessel there is. Close one around a filling and it does four jobs at once — holds a shapeless paste until it sets, keeps the water out while letting the steam in, survives fire, and gives back its own flavour. Every warm country worked this out, and the leaf it had to hand is most of what separates the results.",
    "root": "A filling closed inside a leaf or husk and cooked in it",
    "facets": [
      {
        "id": "wrapper",
        "label": "Wrapper"
      },
      {
        "id": "body",
        "label": "Body"
      },
      {
        "id": "close",
        "label": "Closed"
      },
      {
        "id": "cook",
        "label": "Cooked"
      },
      {
        "id": "region",
        "label": "Region"
      }
    ],
    "nestings": [
      {
        "label": "By wrapper",
        "by": [
          "wrapper",
          "body",
          "cook"
        ]
      },
      {
        "label": "By cooking",
        "by": [
          "cook",
          "body"
        ]
      },
      {
        "label": "By region",
        "by": [
          "region",
          "wrapper"
        ]
      }
    ],
    "dishes": [
      {
        "name": "Tamal",
        "facets": {
          "wrapper": [
            "corn husk",
            "dried"
          ],
          "body": [
            "a paste",
            "nixtamalised masa",
            "beaten with lard"
          ],
          "close": [
            "folded",
            "one end tucked under"
          ],
          "cook": [
            "steamed",
            "stood upright in a pot"
          ],
          "region": [
            "Mesoamerica"
          ]
        },
        "note": "The clearest statement of the problem: a corn paste that cannot hold its own shape until heat has set it, and a husk that holds it while that happens."
      },
      {
        "name": "Humita",
        "facets": {
          "wrapper": [
            "corn husk",
            "green"
          ],
          "body": [
            "a paste",
            "fresh corn milled raw"
          ],
          "close": [
            "folded",
            "tied at both ends"
          ],
          "cook": [
            "steamed",
            "stood upright in a pot"
          ],
          "region": [
            "Andes"
          ]
        },
        "note": "One substitution away from a tamal: fresh corn ground raw instead of dried corn nixtamalised. Sweeter and wetter, and wrapped in this season's green husk rather than last season's dried one."
      },
      {
        "name": "Hallaca",
        "facets": {
          "wrapper": [
            "banana leaf",
            "wilted over flame"
          ],
          "body": [
            "a paste",
            "nixtamalised masa",
            "coloured with annatto",
            "a stewed guiso laid on it"
          ],
          "close": [
            "folded",
            "squared into a rectangle",
            "tied crosswise with twine"
          ],
          "cook": [
            "boiled",
            "hours under water"
          ],
          "region": [
            "Venezuela"
          ]
        },
        "note": "The guiso is stewed the day before and laid on the masa rather than mixed through it, so the parcel keeps two layers apart until you untie it. Tied tight enough to be boiled rather than steamed."
      },
      {
        "name": "Mucbipollo",
        "facets": {
          "wrapper": [
            "banana leaf",
            "several layers"
          ],
          "body": [
            "a paste",
            "nixtamalised masa",
            "coloured with annatto",
            "a thickened kol poured in"
          ],
          "close": [
            "gathered",
            "lashed shut with fibre"
          ],
          "cook": [
            "buried",
            "in an earth oven",
            "hours over hot stones"
          ],
          "region": [
            "Yucatán"
          ]
        },
        "note": "Mucbil means buried. Made once a year for Hanal Pixán and lowered into a pib — a pit of fire-heated stones, covered over with earth for three or four hours."
      },
      {
        "name": "Zongzi",
        "facets": {
          "wrapper": [
            "bamboo leaf",
            "two overlapped"
          ],
          "body": [
            "whole grains",
            "glutinous rice",
            "pork belly",
            "salted duck yolk"
          ],
          "close": [
            "folded",
            "cornered into a pyramid",
            "tied with twine"
          ],
          "cook": [
            "boiled",
            "hours under water"
          ],
          "region": [
            "China"
          ]
        },
        "note": "Whole grains rather than a paste — glutinous rice packed tight enough that hours of boiling fuse it into one sliceable mass without ever being ground."
      },
      {
        "name": "Jianshui zong",
        "parent": "Zongzi",
        "facets": {
          "wrapper": [
            "bamboo leaf",
            "two overlapped"
          ],
          "body": [
            "whole grains",
            "glutinous rice",
            "lye water stirred through",
            "left unfilled"
          ],
          "close": [
            "folded",
            "cornered into a pyramid",
            "tied with twine"
          ],
          "cook": [
            "boiled",
            "hours under water"
          ],
          "region": [
            "Southern China"
          ]
        },
        "note": "A zongzi with alkaline water worked into the rice and the filling left out. It comes out amber and springy and is eaten cold with sugar or syrup — it descends from zongzi, not from the leaf."
      },
      {
        "name": "Lo mai gai",
        "facets": {
          "wrapper": [
            "lotus leaf",
            "one large round"
          ],
          "body": [
            "whole grains",
            "glutinous rice",
            "chicken",
            "cured sausage"
          ],
          "close": [
            "folded",
            "squared into a parcel"
          ],
          "cook": [
            "steamed",
            "in a bamboo basket"
          ],
          "region": [
            "Guangdong"
          ]
        },
        "note": "The same rice as a zongzi in a different leaf: lotus scents it like tea where bamboo scents it like cut grass. Steamed rather than boiled, because a single round leaf folds shut but does not seal."
      },
      {
        "name": "Bánh chưng",
        "facets": {
          "wrapper": [
            "dong leaf",
            "four squared off"
          ],
          "body": [
            "whole grains",
            "glutinous rice",
            "mung bean paste",
            "pork belly"
          ],
          "close": [
            "folded",
            "boxed into a square",
            "tied with split bamboo"
          ],
          "cook": [
            "boiled",
            "hours under water",
            "pressed under weight after"
          ],
          "region": [
            "Vietnam"
          ]
        },
        "note": "Layered rice, bean, pork, bean, rice, so the cut face reads as rings. The stiff midrib of the dong leaf is what lets it hold a square with no mould, and it is the only parcel here that is finished after it leaves the pot — pressed under a board to drive the water out."
      },
      {
        "name": "Lontong",
        "facets": {
          "wrapper": [
            "banana leaf",
            "wilted over flame"
          ],
          "body": [
            "whole grains",
            "plain rice",
            "left unfilled"
          ],
          "close": [
            "rolled",
            "into a cylinder",
            "pinned with bamboo slivers"
          ],
          "cook": [
            "boiled",
            "hours under water"
          ],
          "region": [
            "Indonesia",
            "Malaysia"
          ]
        },
        "note": "No filling at all — here the leaf is purely a mould. Rice boiled with nowhere to expand compacts into a cake dense enough to slice, which is what makes it a vehicle for satay sauce rather than a bowl of rice."
      },
      {
        "name": "Pepes ikan",
        "facets": {
          "wrapper": [
            "banana leaf",
            "wilted over flame"
          ],
          "body": [
            "loose filling",
            "fish",
            "ground bumbu"
          ],
          "close": [
            "folded",
            "flattened into a packet",
            "pinned with bamboo slivers"
          ],
          "cook": [
            "steamed",
            "then finished over coals"
          ],
          "region": [
            "West Java"
          ]
        },
        "note": "A loose filling only needs holding, so the packet is flat and pinned rather than tied. Steamed to cook it through, then laid on coals so the leaf scorches and gives its smoke back."
      },
      {
        "name": "Otak-otak",
        "facets": {
          "wrapper": [
            "banana leaf",
            "wilted over flame"
          ],
          "body": [
            "a paste",
            "pounded fish",
            "coconut milk"
          ],
          "close": [
            "folded",
            "flattened into a packet",
            "pinned with bamboo slivers"
          ],
          "cook": [
            "grilled",
            "over coals"
          ],
          "region": [
            "Malay peninsula",
            "Singapore"
          ]
        },
        "note": "Pepes with one decision changed: pound the fish to a paste instead of leaving it in pieces, and go straight to the coals. The paste needs containing where the pieces did not — and it sets into a slab you can pick up by the leaf."
      },
      {
        "name": "Dolma",
        "facets": {
          "wrapper": [
            "grape leaf",
            "brined"
          ],
          "body": [
            "loose filling",
            "raw rice",
            "herbs",
            "olive oil"
          ],
          "close": [
            "rolled",
            "into a cigar"
          ],
          "cook": [
            "simmered",
            "in oil and lemon",
            "weighted with a plate"
          ],
          "region": [
            "Anatolia",
            "Levant",
            "Balkans"
          ]
        },
        "note": "The one wrapper here you are certainly meant to eat, which is why it is brined rather than merely softened. Nothing ties it shut; a plate laid over the pan does the work a string does elsewhere."
      },
      {
        "name": "Moin moin",
        "facets": {
          "wrapper": [
            "uma leaf",
            "wilted over flame"
          ],
          "body": [
            "a paste",
            "milled black-eyed peas",
            "boiled egg set into it"
          ],
          "close": [
            "folded",
            "cupped into a cone"
          ],
          "cook": [
            "steamed",
            "stood upright in a pot"
          ],
          "region": [
            "Nigeria"
          ]
        },
        "note": "A bean paste where the Americas use a corn one, set by heat in exactly the same way. Ewé eran is chosen for what it gives back, which is the argument against the tin can that keeps replacing it."
      },
      {
        "name": "Kenkey",
        "facets": {
          "wrapper": [
            "corn husk",
            "dried"
          ],
          "body": [
            "a paste",
            "fermented maize dough",
            "half of it cooked first",
            "left unfilled"
          ],
          "close": [
            "gathered",
            "balled",
            "tied with husk strips"
          ],
          "cook": [
            "boiled",
            "hours under water"
          ],
          "region": [
            "Ghana"
          ]
        },
        "note": "Ga kenkey, in dried maize husks — the same wrapper as a tamal, an ocean away. The dough is soured for days, then half of it is cooked into a stiff paste and kneaded back through the raw half; that is what sets it in the husk. Fanti kenkey answers the same question with plantain leaves and no salt."
      },
      {
        "name": "Patra",
        "facets": {
          "wrapper": [
            "colocasia leaf",
            "veins shaved flat"
          ],
          "body": [
            "a paste",
            "gram flour",
            "tamarind",
            "spread on the leaf"
          ],
          "close": [
            "rolled",
            "into a spiral"
          ],
          "cook": [
            "steamed",
            "then sliced and fried"
          ],
          "region": [
            "Gujarat",
            "Konkan"
          ]
        },
        "note": "Inside out. The paste is spread onto stacked leaves and the whole stack rolled up, so the wrapper runs through every slice instead of being thrown away. Patrode in the Konkan, alu vadi in Maharashtra."
      },
      {
        "name": "Laulau",
        "facets": {
          "wrapper": [
            "ti leaf",
            "taro leaf inside"
          ],
          "body": [
            "loose filling",
            "pork",
            "salted butterfish"
          ],
          "close": [
            "gathered",
            "knotted with ti-leaf strips"
          ],
          "cook": [
            "buried",
            "in an imu",
            "hours over hot stones"
          ],
          "region": [
            "Hawaiʻi"
          ]
        },
        "note": "Two leaves doing two jobs: the lūʻau leaves inside collapse into the pork and are eaten, the ti leaf outside is structure and is not. The imu is the same idea as the pib, half a world east."
      }
    ],
    "notes": [
      {
        "title": "The leaf is equipment",
        "body": "It is tempting to read the wrapper as packaging. It is not — it is the pot. It holds a paste that has no shape of its own, it lets steam in and keeps boiling water out, it takes direct fire without burning what it holds, and it seasons. That last job is why the same glutinous rice becomes zongzi in bamboo and lo mai gai in lotus: nothing about the filling changed."
      },
      {
        "title": "Paste or grain or pieces",
        "body": "The fork that decides everything downstream. A paste has to be contained until heat sets it, so paste parcels are folded tight and usually tied — untie a raw one and it runs. Whole grains need packing and a long wet cook to fuse. A loose filling only needs holding, which is why a vine leaf rolled into a cigar with nothing to close it is enough for dolma, and would be nowhere near enough for a tamal."
      },
      {
        "title": "On depth",
        "body": "Only jianshui zong sits a level down, because it genuinely is a zongzi with lye stirred through and the filling left out. Tamal, hallaca, mucbipollo, humita and kenkey are all corn-paste parcels, and none of them descends from another — they are separate answers to the same problem and belong at the same depth. Calling any of them a version of the tamal makes the picture tidier and the claim false."
      }
    ],
    "sources": [
      {
        "label": "Tamale (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Tamale"
      },
      {
        "label": "Zongzi",
        "url": "https://en.wikipedia.org/wiki/Zongzi"
      },
      {
        "label": "Hallaca",
        "url": "https://en.wikipedia.org/wiki/Hallaca"
      },
      {
        "label": "Bánh chưng",
        "url": "https://en.wikipedia.org/wiki/B%C3%A1nh_ch%C6%B0ng"
      },
      {
        "label": "Dolma",
        "url": "https://en.wikipedia.org/wiki/Dolma"
      },
      {
        "label": "Kenkey",
        "url": "https://en.wikipedia.org/wiki/Kenkey"
      },
      {
        "label": "Moin moin",
        "url": "https://en.wikipedia.org/wiki/Moin_moin"
      },
      {
        "label": "Patrode",
        "url": "https://en.wikipedia.org/wiki/Patrode"
      },
      {
        "label": "Laulau",
        "url": "https://en.wikipedia.org/wiki/Laulau"
      },
      {
        "label": "Otak-otak",
        "url": "https://en.wikipedia.org/wiki/Otak-otak"
      },
      {
        "label": "Mukbilpollo or pib (Yucatán Today)",
        "url": "https://yucatantoday.com/en/blog/the-recipe-of-mukbilpollo-or-pib-yucateco"
      }
    ],
    "yours": [
      "tamale",
      "tamal",
      "dolma",
      "sarma",
      "zongzi",
      "banana leaf",
      "otak-otak",
      "pepes",
      "lontong",
      "laulau",
      "moin moin"
    ]
  }
];
