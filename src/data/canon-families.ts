import type { Canon } from './canon';

/**
 * Generated from data/canon/*.json by scripts/build-canon.mjs — do not edit.
 *
 * Families are authored as data so they can be written or reviewed without
 * touching TypeScript. Run the script after changing any of them.
 */
export const CANON_FAMILIES: Canon[] = [
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
  }
];
