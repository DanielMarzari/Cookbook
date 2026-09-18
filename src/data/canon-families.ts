import type { Canon } from './canon';

/**
 * Generated from data/canon/*.json by scripts/build-canon.mjs — do not edit.
 *
 * Families are authored as data so they can be written or reviewed without
 * touching TypeScript. Run the script after changing any of them.
 */
export const CANON_FAMILIES: Canon[] = [
  {
    "slug": "aromatic-base",
    "name": "Aromatic base",
    "standfirst": "Almost every cooked dish begins with something chopped going into hot fat before anything the dish is named after arrives. In Europe the vegetables barely vary — an onion and two friends — but what a kitchen does to them decides more about how the finished plate tastes than the meat does. Mirepoix and the holy trinity are the same knife and the same pan; swap the carrot for a green pepper and you are in another country. Four questions separate all of them: what goes in, what it goes into, whether you stop it before it colours or push it until the oil comes back out, and whether it was chopped at all — or pounded, or blended raw, or never fried in the first place.",
    "root": "Aromatics cut small and given to the pot first, before anything the dish is named after",
    "facets": [
      {
        "id": "aromatics",
        "label": "Aromatics"
      },
      {
        "id": "fat",
        "label": "Fat"
      },
      {
        "id": "form",
        "label": "Form"
      },
      {
        "id": "heat",
        "label": "Heat"
      },
      {
        "id": "region",
        "label": "Region"
      }
    ],
    "nestings": [
      {
        "label": "By how far it is cooked",
        "by": [
          "heat",
          "form",
          "fat"
        ]
      },
      {
        "label": "By what the knife does",
        "by": [
          "form",
          "heat",
          "aromatics"
        ]
      },
      {
        "label": "By region",
        "by": [
          "region",
          "heat"
        ]
      }
    ],
    "dishes": [
      {
        "name": "Mirepoix",
        "facets": {
          "aromatics": [
            "onion",
            "carrot",
            "celery"
          ],
          "fat": [
            "butter"
          ],
          "form": [
            "diced with a knife",
            "sized to the cooking time"
          ],
          "heat": [
            "kept pale",
            "sweated until it turns translucent"
          ],
          "region": [
            "France"
          ]
        },
        "note": "Two parts onion to one carrot to one celery, by weight, and the dice is the only real decision left: large for a stock that will run four hours, small for a sauce that has twenty minutes. Cut it fine and cook it long and it disappears, which for a stock is the wrong answer — it is meant to be strained out still recognisable."
      },
      {
        "name": "Soffritto",
        "facets": {
          "aromatics": [
            "onion",
            "carrot",
            "celery"
          ],
          "fat": [
            "olive oil",
            "butter in the north"
          ],
          "form": [
            "diced with a knife",
            "cut finer than a mirepoix"
          ],
          "heat": [
            "kept pale",
            "half an hour on the lowest flame"
          ],
          "region": [
            "Italy"
          ]
        },
        "note": "The same three vegetables as mirepoix and the opposite intention: this one is supposed to vanish. Before it meets the fat the raw chopped mix has its own name, battuto; soffriggere means to under-fry, and the whole instruction is in the word."
      },
      {
        "name": "Suppengrün",
        "facets": {
          "aromatics": [
            "leek",
            "carrot",
            "celeriac",
            "parsley root"
          ],
          "fat": [
            "no fat"
          ],
          "form": [
            "cut in large pieces",
            "left big enough to fish back out"
          ],
          "heat": [
            "never fried",
            "simmered in the liquid",
            "lifted out and thrown away"
          ],
          "region": [
            "Germany"
          ]
        },
        "note": "Sold as a bundle rather than a recipe — a leek, a carrot, a wedge of celeriac, tied together at the greengrocer. It is the one thing here that is not a base at all: it flavours by extraction and then leaves, which is a bouquet garni's job done with root vegetables."
      },
      {
        "name": "Holy trinity",
        "facets": {
          "aromatics": [
            "onion",
            "celery",
            "green bell pepper"
          ],
          "fat": [
            "oil",
            "thickened into a roux with flour"
          ],
          "form": [
            "diced with a knife",
            "cut even so nothing catches"
          ],
          "heat": [
            "kept pale",
            "added to fat already browned",
            "the roux taken to peanut or chocolate first",
            "the vegetables stop the roux cooking"
          ],
          "region": [
            "United States",
            "Louisiana"
          ]
        },
        "note": "Mirepoix with the carrot swapped out — the sugar goes, a green vegetal bitterness comes in. The colour is settled before the vegetables ever appear: the flour and oil are taken to whatever shade the dish wants, and the trinity goes in cold to arrest it. The vegetables themselves never colour; all they do is soften and stop the roux."
      },
      {
        "name": "Sofregit",
        "facets": {
          "aromatics": [
            "onion",
            "tomato",
            "garlic"
          ],
          "fat": [
            "olive oil"
          ],
          "form": [
            "sliced thin"
          ],
          "heat": [
            "taken to deep brown",
            "an hour or more",
            "a kilo of onion down to a cupful"
          ],
          "region": [
            "Spain",
            "Catalonia"
          ]
        },
        "note": "The Castilian sofrito is the same move made in less time; Catalan cooks take it until it is nearly tarry. It is also half of a pair — sofregit opens the dish and a picada pounded from nuts and garlic closes it, and everything else happens in between."
      },
      {
        "name": "Refogado",
        "facets": {
          "aromatics": [
            "onion",
            "garlic",
            "bay leaf"
          ],
          "fat": [
            "olive oil",
            "neutral oil in Brazil"
          ],
          "form": [
            "chopped fine"
          ],
          "heat": [
            "taken to gold",
            "ten minutes and no more"
          ],
          "region": [
            "Portugal"
          ]
        },
        "note": "The shortest of the Iberian bases and the most used: in Brazil the pot of beans and the pan of rice both start here, most days, in most houses. Ten minutes is the whole technique, which is why it survived the crossing intact when longer ones did not."
      },
      {
        "name": "Sofrito",
        "facets": {
          "aromatics": [
            "onion",
            "garlic",
            "culantro",
            "ají dulce",
            "cubanelle pepper"
          ],
          "fat": [
            "olive oil",
            "annatto lard in some kitchens"
          ],
          "form": [
            "blended",
            "nothing cooked first",
            "frozen in cubes"
          ],
          "heat": [
            "kept pale",
            "a minute in hot oil",
            "kept green"
          ],
          "region": [
            "Puerto Rico"
          ]
        },
        "note": "The Iberian sofrito crossed the Atlantic and stopped being a cooked thing. It is blended raw by the litre and kept in the freezer, so the cooking happens later and briefly, when a spoonful hits the oil. What is in the jar here is the green one, recaíto, named for the recao — culantro — that makes it; put tomato in and it is sofrito proper."
      },
      {
        "name": "Epis",
        "facets": {
          "aromatics": [
            "garlic",
            "scallion",
            "parsley",
            "thyme",
            "scotch bonnet"
          ],
          "fat": [
            "olive oil",
            "blended in rather than fried in"
          ],
          "form": [
            "blended",
            "nothing cooked first",
            "loosened with vinegar and sour orange"
          ],
          "heat": [
            "never fried",
            "used raw as a marinade"
          ],
          "region": [
            "Haiti"
          ]
        },
        "note": "The acid is what separates it from its Spanish-speaking neighbours. Vinegar and sour orange make it a keeping paste and a marinade at once, so it seasons the meat before the pot rather than the pot before the meat."
      },
      {
        "name": "Recaudo",
        "facets": {
          "aromatics": [
            "tomato",
            "onion",
            "garlic",
            "dried chilli"
          ],
          "fat": [
            "lard",
            "oil where lard is not used"
          ],
          "form": [
            "blended",
            "charred whole on a comal first"
          ],
          "heat": [
            "taken to deep brown",
            "poured into fat already smoking",
            "cooked until it darkens and thickens"
          ],
          "region": [
            "Mexico"
          ]
        },
        "note": "The only base here that goes into the pan as a liquid. Everything is blackened dry on a comal, blended skins and all, then thrown into smoking lard where it seizes and spits and slowly tightens — freír la salsa, and the guisado is only ever as good as that step."
      },
      {
        "name": "Piaz dagh",
        "facets": {
          "aromatics": [
            "onion",
            "turmeric"
          ],
          "fat": [
            "oil",
            "enough to half-submerge the onion"
          ],
          "form": [
            "sliced thin"
          ],
          "heat": [
            "taken to deep brown",
            "fried in quantity and kept under its own oil"
          ],
          "region": [
            "Iran"
          ]
        },
        "note": "Hot onion, literally. Almost every khoresh begins with a spoonful of it, so it is made by the kilo and stored rather than started fresh — the base is a pantry item, not a first step. The turmeric goes in with the onion and colours it as much as the frying does."
      },
      {
        "name": "Ginger and scallion",
        "facets": {
          "aromatics": [
            "ginger",
            "scallion",
            "garlic"
          ],
          "fat": [
            "oil",
            "neutral and high-smoking"
          ],
          "form": [
            "sliced thin",
            "scallion cut into lengths"
          ],
          "heat": [
            "seconds in hot fat",
            "over the highest heat the burner has"
          ],
          "region": [
            "China"
          ]
        },
        "note": "Bào xiāng — explode the fragrance. Measured in seconds rather than minutes, and the shortest base on this table by two orders of magnitude: leave it any longer and the garlic turns acrid and the scallion goes bitter, and there is nothing to do but start again."
      },
      {
        "name": "Bhuna masala",
        "facets": {
          "aromatics": [
            "onion",
            "garlic",
            "ginger",
            "tomato"
          ],
          "fat": [
            "ghee",
            "mustard oil in the east"
          ],
          "form": [
            "chopped fine",
            "the ginger and garlic pounded to a paste"
          ],
          "heat": [
            "cooked until the oil separates out",
            "the onion taken deep brown first"
          ],
          "region": [
            "India"
          ]
        },
        "note": "Bhunao is a verb for a state, not a duration. The onion goes dark, the tomato goes in and collapses, and the step is over when the fat visibly leaves the mass and pools at the edge of the pan — no clock is given because none is needed."
      },
      {
        "name": "Tarka",
        "facets": {
          "aromatics": [
            "cumin seed",
            "mustard seed",
            "dried chilli",
            "curry leaf",
            "asafoetida"
          ],
          "fat": [
            "ghee",
            "coconut oil in the south"
          ],
          "form": [
            "left whole",
            "the slowest seed first and the leaves last"
          ],
          "heat": [
            "seconds in hot fat",
            "poured over at the end"
          ],
          "region": [
            "India"
          ]
        },
        "note": "The only base here that arrives last. Fat pulls the aroma out of a seed in seconds, and pouring the lot over a finished dal puts it on top rather than through it, where nothing simmers it away. Also called tadka or chhaunk in the north, vaghar in Gujarat, phodni in Maharashtra, baghar in the Deccan, phoron in Bengal — one move, seven names."
      },
      {
        "name": "Obe ata",
        "facets": {
          "aromatics": [
            "onion",
            "red bell pepper",
            "scotch bonnet",
            "tomato"
          ],
          "fat": [
            "palm oil",
            "neutral oil for lighter stews"
          ],
          "form": [
            "blended",
            "nothing cooked first",
            "blended with as little water as possible"
          ],
          "heat": [
            "cooked until the oil separates out",
            "boiled down first to drive off the water",
            "thirty minutes in the oil"
          ],
          "region": [
            "Nigeria"
          ]
        },
        "note": "Blended it is ata lilo; fried it is ata din din, and every red stew in the country comes off that one pot — jollof, buka stew, ofada. The tatashe is there for colour and body and the ata rodo for heat, which is why they are two peppers and not one."
      },
      {
        "name": "Krueng gaeng",
        "facets": {
          "aromatics": [
            "shallot",
            "lemongrass",
            "galangal",
            "kaffir lime zest",
            "dried chilli",
            "shrimp paste"
          ],
          "fat": [
            "coconut cream",
            "its own oil once it splits"
          ],
          "form": [
            "pounded to a paste",
            "in a granite mortar",
            "hardest thing first and softest last"
          ],
          "heat": [
            "cooked until the oil separates out",
            "cracked in coconut cream rather than oil"
          ],
          "region": [
            "Thailand"
          ]
        },
        "note": "Pounding is not chopping done slowly. A pestle ruptures cells all the way through where a blade only opens the ones it meets, which is why a blitzed paste tastes thinner from the same ingredients. The cream is boiled until it splits and the paste fries in the oil that comes out of it."
      },
      {
        "name": "Wat base",
        "facets": {
          "aromatics": [
            "onion",
            "garlic",
            "ginger"
          ],
          "fat": [
            "niter kibbeh",
            "no fat at all to begin with"
          ],
          "form": [
            "chopped fine",
            "cut small enough to melt"
          ],
          "heat": [
            "taken to deep brown",
            "started dry in a bare pan",
            "the spiced butter added once it has collapsed"
          ],
          "region": [
            "Ethiopia"
          ]
        },
        "note": "Red onion in quantity, cooked in a dry pan with nothing in it. An onion is mostly water; drive that off first and it wilts and browns in its own sugars, and only then does the niter kibbeh go in — so the spiced butter is warmed through rather than fried for an hour and ruined."
      }
    ],
    "notes": [
      {
        "title": "On the same three vegetables",
        "body": "Onion, carrot and celery is not a discovery, it is an inventory: three things that keep all winter in a cold cellar. Mirepoix and soffritto are the identical trio put to opposite ends. The trinity drops the carrot for green pepper, trading sweetness for a vegetal edge. Suppengrün drops the onion for a leek and the celery stalk for its root. Where the cellar held other things — shallot and galangal, tatashe and ata rodo, ginger and scallion — the base looks nothing like the European one and does exactly the same job, which is the argument that the job is real and the vegetables are incidental."
      },
      {
        "title": "On pale and brown",
        "body": "This is the fork that changes what the base is for. Kept pale, it still tastes of onion and carrot and sits underneath the dish as seasoning. Taken brown, it becomes an ingredient with no raw equivalent: sugars caramelise, Maillard runs, and a kilo of sliced onion turns into a cupful of something sweet and meaty that nothing else in the kitchen can supply. Sofregit and piaz dagh spend an hour making that ingredient deliberately. A dish built on a brown base cannot be rescued with a pale one, or the reverse — it is not a matter of degree, they are two different foods."
      },
      {
        "title": "On the oil coming back",
        "body": "Three bases in three kitchens share one signal and no clock: cook until the fat pools at the edge. Water and fat cannot fry together, so as long as the base is wet it is only steaming, however hot the burner. When the water has finally gone the fat separates out and visibly returns, and only then does anything brown. Bhunao in a north Indian pan, half an hour of ata din din in palm oil, krueng cracked in coconut cream — same test, same moment, and not a thermometer between them."
      },
      {
        "title": "On chopped and pounded and blended",
        "body": "A knife opens the cells it meets. A pestle ruptures them all the way through, which is why krueng is pounded and a blender version of it tastes thinner from the same shopping. A blender does a third thing again — it shreds, and it whips in air and water. That is why a blended base is either never cooked at all, like epis, or fried far longer than its weight suggests, like obe ata and recaudo — with sofrito the exception that proves the rule, blended and barely cooked because it is a seasoning fired from a frozen cube rather than a base reduced in the pan, driving off water the blender put in."
      },
      {
        "title": "On when it goes in",
        "body": "Everything here happens before the dish except one. A tarka is the same move as the Chinese ginger and scallion — whole aromatics in hot fat for a few seconds — but it is poured over a finished dal at the end, so nothing ever simmers on top of it and the volatiles survive to the table. It is proof that a base is defined by position rather than content. The identical seeds in the identical ghee at the start of the pot would be a different thing, and you would not be able to hear it arrive."
      },
      {
        "title": "On refusing the fat",
        "body": "Two entries never fry at all — and a third, the wat base, postpones the fat rather than refusing it and they are not variations of each other. Suppengrün skips it permanently: cut big, simmered in the liquid, lifted out and binned, flavouring by extraction the way a bouquet garni does. The wat base skips it only at the start, and for the opposite reason — a dry pan browns the onion faster and harder than oil would, because there is no fat holding the temperature down and nothing to fry in until the onion's own water is gone."
      }
    ],
    "sources": [
      {
        "label": "Mirepoix (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Mirepoix_(cuisine)"
      },
      {
        "label": "Sofrito (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Sofrito"
      },
      {
        "label": "Suppengrün (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Suppengr%C3%BCn"
      },
      {
        "label": "Holy trinity (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Holy_trinity_(cuisine)"
      },
      {
        "label": "Recaíto (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Reca%C3%ADto"
      },
      {
        "label": "Picada (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Picada"
      },
      {
        "label": "Obe ata (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Obe_ata"
      },
      {
        "label": "Tempering spices (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Tempering_(spices)"
      },
      {
        "label": "Niter kibbeh (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Niter_kibbeh"
      },
      {
        "label": "Haitian cuisine (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Haitian_cuisine"
      },
      {
        "label": "Piaz dagh (PersianGood)",
        "url": "https://persiangood.com/recipes/piaz-dagh-fried-onions/"
      },
      {
        "label": "Recaudo (Familia Kitchen)",
        "url": "https://familiakitchen.com/gollitas-essential-mexican-recaudo/"
      },
      {
        "label": "Southern Thai curry paste (Eating Thai Food)",
        "url": "https://www.eatingthaifood.com/how-to-make-southern-thai-curry-paste/"
      },
      {
        "label": "Doro wat and the dry onion base (Hunter Angler Gardener Cook)",
        "url": "https://honest-food.net/doro-wat-recipe/"
      }
    ],
    "yours": [
      "mirepoix",
      "soffritto",
      "sofrito",
      "sofregit",
      "refogado",
      "holy trinity",
      "suppengrün",
      "epis",
      "recaudo",
      "piaz dagh",
      "fried onions",
      "tarka",
      "tadka",
      "masala base",
      "pepper stew",
      "obe ata",
      "curry paste",
      "niter kibbeh",
      "base"
    ]
  },
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
        "name": "Adobo (Filipino)",
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
        "parent": "Adobo (Filipino)",
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
    "slug": "chilli-condiment",
    "name": "Chilli condiment",
    "standfirst": "A chilli picked today is gone in a week. Most of these are that same fruit made to keep — pounded raw with salt, boiled with the water thrown away, dried down on a roof, fermented in a jar, or fried into hot oil — and then given company: caraway in Tunis, blue fenugreek in Abkhazia, dried scallop in Hong Kong, fermented broad beans in Pixian. Two keep nothing at all: zhoug is finished inside a fortnight, and awaze is stirred to order from a powder that did the preserving months before. What separates them is which of those six things is done to the chilli, whether you end up with a paste or an oil, and what went in besides.",
    "root": "Chilli · salt · and usually something done to make it keep — more salt, oil, a ferment, or the sun",
    "facets": [
      {
        "id": "chilli",
        "label": "The chilli"
      },
      {
        "id": "method",
        "label": "Method"
      },
      {
        "id": "add",
        "label": "Added"
      },
      {
        "id": "form",
        "label": "Ends up"
      },
      {
        "id": "region",
        "label": "Region"
      }
    ],
    "nestings": [
      {
        "label": "By what happens to the chilli",
        "by": [
          "method",
          "form",
          "add"
        ]
      },
      {
        "label": "By the chilli itself",
        "by": [
          "chilli",
          "method"
        ]
      },
      {
        "label": "By region",
        "by": [
          "region",
          "method"
        ]
      },
      {
        "label": "By what else is in the jar",
        "by": [
          "add",
          "method"
        ]
      }
    ],
    "dishes": [
      {
        "name": "Sambal oelek",
        "facets": {
          "region": [
            "Indonesia",
            "Java"
          ],
          "chilli": [
            "fresh chillies",
            "seeds left in"
          ],
          "method": [
            "pounded raw",
            "ground in a stone mortar"
          ],
          "add": [
            "nothing else",
            "salt"
          ],
          "form": [
            "a paste",
            "coarse",
            "no oil in it",
            "weeks in the fridge"
          ]
        },
        "note": "The name is the method, not the chilli — ulek is the grinding, done with a stone pestle in a cobek, and it never sees heat. Chilli, salt and the friction of stone; the vinegar in the imported jars is there to make a shelf-stable product out of something Javanese cooks make fresh. It is the plainest thing in this family and the starting point for a hundred other sambals."
      },
      {
        "name": "Zhoug",
        "facets": {
          "region": [
            "Yemen"
          ],
          "chilli": [
            "fresh chillies",
            "green ones"
          ],
          "method": [
            "pounded raw",
            "herbs and chilli in the same mortar"
          ],
          "add": [
            "garlic",
            "a herb",
            "coriander leaf by the bunch"
          ],
          "form": [
            "a paste",
            "loose and green",
            "fridge only",
            "a week or two"
          ]
        },
        "note": "Also spelled s'hug or schug, and carried from Yemen to Israel, where it now sits on every hummus counter. The only one here where the chilli is outnumbered — cardamom and cumin behind a bunch of coriander leaf, a herb sauce that happens to be hot. Which is why it will not keep: the leaf goes black in a fortnight and no amount of salt will stop it. Made with red chillies it is the same sauce a different colour."
      },
      {
        "name": "Ajika",
        "facets": {
          "region": [
            "Abkhazia"
          ],
          "chilli": [
            "fresh chillies",
            "wilted in the sun first"
          ],
          "method": [
            "pounded raw",
            "ground with a great deal of salt"
          ],
          "add": [
            "garlic",
            "a spice",
            "blue fenugreek"
          ],
          "form": [
            "a paste",
            "dense",
            "salt is the only preservative",
            "keeps a year"
          ]
        },
        "note": "The word is Abkhaz for salt, which tells you what it is built on — no oil, no vinegar, no ferment, just enough salt to make the jar uninhabitable, and a few days on the counter to mature before it goes away. Coriander seed goes in beside the blue fenugreek, and walnut in some houses. The Megrelian and Abkhaz versions have no tomato in them; the Russian jars sold under the name usually do."
      },
      {
        "name": "Ají amarillo paste",
        "facets": {
          "region": [
            "Peru"
          ],
          "chilli": [
            "fresh chillies",
            "seeds and veins stripped out"
          ],
          "method": [
            "boiled first",
            "the water changed two or three times"
          ],
          "add": [
            "nothing else",
            "salt"
          ],
          "form": [
            "a paste",
            "smooth",
            "milder than its colour promises",
            "frozen rather than shelved"
          ]
        },
        "note": "The only one that deliberately throws heat away. Blanching in changed water leaves the colour and the fruitiness behind and takes the burn out with the water; the flesh is then blended smooth with a little oil to loosen it. The paste is a pigment and a flavour first and a chilli second — and the only one here that keeps by being frozen rather than by anything done in the jar."
      },
      {
        "name": "Harissa",
        "facets": {
          "region": [
            "Tunisia"
          ],
          "chilli": [
            "dried chillies",
            "baklouti soaked back to soft"
          ],
          "method": [
            "pounded raw",
            "the spices pounded in with it"
          ],
          "add": [
            "garlic",
            "a spice",
            "caraway"
          ],
          "form": [
            "a paste",
            "thick",
            "sealed under a film of oil",
            "months in the fridge"
          ]
        },
        "note": "Caraway is the tell. Strip it out and you have a generic pounded chilli paste; leave it in, with coriander seed and garlic beside it, and no other condiment in this family tastes remotely like it. Some houses roast the soaked peppers first, but nobody simmers the paste. The olive oil poured on top is a lid rather than an ingredient — what is underneath is not an oil sauce."
      },
      {
        "name": "Biber salçası",
        "facets": {
          "region": [
            "Turkey",
            "Hatay"
          ],
          "chilli": [
            "fresh chillies",
            "long red peppers"
          ],
          "method": [
            "dried in the sun",
            "stirred twice a day for a week"
          ],
          "add": [
            "nothing else",
            "salt"
          ],
          "form": [
            "a paste",
            "dense and dark",
            "sealed under oil",
            "a year in the pantry"
          ]
        },
        "note": "The roof does the work a stove would. The peppers are pulped, spread thin on trays and left on a cloth-covered terrace, and a week of Anatolian sun takes them down to a paste with almost no water left in it — concentrated by evaporation rather than by cooking or by salt. The same process makes the hot acı and the mild tatlı; the pepper decides which."
      },
      {
        "name": "Shatta",
        "facets": {
          "region": [
            "Levant",
            "Palestine"
          ],
          "chilli": [
            "fresh chillies",
            "red or green"
          ],
          "method": [
            "fermented in salt",
            "a few days in a warm window"
          ],
          "add": [
            "garlic",
            "an acid",
            "lemon"
          ],
          "form": [
            "a paste",
            "loose",
            "sealed under oil",
            "months"
          ]
        },
        "note": "Sits in the jar looking exactly like harissa and is made the other way round: fermented first, spiced barely at all, and with no caraway anywhere near it. The sourness is lactic rather than added — the lemon stirred in at the end only stops the clock — and the olive oil goes over the top to seal what the ferment made."
      },
      {
        "name": "Doubanjiang",
        "facets": {
          "region": [
            "China",
            "Sichuan",
            "Pixian"
          ],
          "chilli": [
            "fresh chillies",
            "erjingtiao"
          ],
          "method": [
            "fermented in salt",
            "the beans cultured with a mould starter first"
          ],
          "add": [
            "a fermented bean",
            "broad beans"
          ],
          "form": [
            "a paste",
            "dark red-brown",
            "fried in oil before it is used",
            "keeps for years"
          ]
        },
        "note": "Two ferments, run apart and then introduced: the erjingtiao chillies salted whole and left to sour for months, the broad beans grown with a mould starter and a little wheat flour for six. The married crocks are opened every day to be stirred and left standing in the sun for one to three years, which is why an old paste is brown rather than red — the colour is spent, the flavour is what is left."
      },
      {
        "name": "Gochujang",
        "facets": {
          "region": [
            "Korea"
          ],
          "chilli": [
            "chilli already ground",
            "sun-dried gochugaru"
          ],
          "method": [
            "fermented in salt",
            "aged in onggi on the jangdokdae"
          ],
          "add": [
            "a fermented bean",
            "soybean meju powder"
          ],
          "form": [
            "a paste",
            "thick and sticky",
            "as sweet as it is hot",
            "keeps for years"
          ]
        },
        "note": "The jangdokdae is the raised stone platform in the yard where the onggi stand, sited for sun — the roof is the modern apartment substitute for it, not the tradition. The sweetness is not sugar added at the end: the glutinous rice is cooked and cooled before the jar is built, and barley malt enzymes then break its starch down into sugar inside the onggi while the soybean meju culture works on the protein. The sweet and the savoury are both made in place, which no amount of stirring honey into chilli paste will imitate."
      },
      {
        "name": "Chilli oil",
        "facets": {
          "region": [
            "China",
            "Sichuan"
          ],
          "chilli": [
            "chilli already ground",
            "coarse flakes toasted first"
          ],
          "method": [
            "fried in oil",
            "hot oil poured over the flakes"
          ],
          "add": [
            "nothing else",
            "salt"
          ],
          "form": [
            "oil alone",
            "clear red",
            "the solids strained out",
            "months"
          ]
        },
        "note": "La you. Temperature is the entire recipe: too hot and the flakes go bitter in seconds, too cool and neither colour nor smell comes out of them. The usual answer is to pour the oil over in two or three goes at falling temperatures — one for aroma, one for colour. Some versions steep cassia and star anise in the oil beforehand, but the jar that results is still chilli, salt and fat."
      },
      {
        "name": "Chilli crisp",
        "parent": "Chilli oil",
        "facets": {
          "region": [
            "China",
            "Guizhou"
          ],
          "chilli": [
            "chilli already ground",
            "coarse flakes"
          ],
          "method": [
            "fried in oil",
            "aromatics fried in until crisp"
          ],
          "add": [
            "garlic",
            "a nut",
            "fried soybeans"
          ],
          "form": [
            "oil with solids in it",
            "crunchy",
            "spooned rather than poured",
            "months"
          ]
        },
        "note": "Chilli oil with the frying left visible — everything that would have been strained out is kept, and more is fried in on purpose: soybeans and peanuts taken to crisp, garlic, fermented black beans. It descends from la you rather than standing beside it, which is why it is the only dish here sitting a level down."
      },
      {
        "name": "Salsa macha",
        "facets": {
          "region": [
            "Mexico",
            "Veracruz"
          ],
          "chilli": [
            "dried chillies",
            "morita for the smoke"
          ],
          "method": [
            "fried in oil",
            "chillies and nuts fried in the same pan"
          ],
          "add": [
            "garlic",
            "a nut",
            "peanuts"
          ],
          "form": [
            "oil with solids in it",
            "gritty rather than crunchy",
            "spooned rather than poured",
            "months"
          ]
        },
        "note": "The same answer as chilli crisp reached in the mountains above Orizaba with no contact whatsoever — peanuts and sesame seeds fried alongside morita and árbol chillies, then blended only part of the way. The older Veracruz versions were dry ground chilli-and-seed pastes with no oil at all; the oil arrived with the Spanish and turned a paste into a salsa."
      },
      {
        "name": "Nam phrik phao",
        "facets": {
          "region": [
            "Thailand"
          ],
          "chilli": [
            "dried chillies",
            "long red phrik haeng"
          ],
          "method": [
            "fried in oil",
            "everything dry-roasted in a wok first"
          ],
          "add": [
            "garlic",
            "dried seafood",
            "dried shrimp"
          ],
          "form": [
            "oil with solids in it",
            "jammy",
            "as sweet and sour as it is hot",
            "months"
          ]
        },
        "note": "Roasted before it is fried, which is where the darkness comes from. Shallots go into the dry wok with the garlic and the dried shrimp; tamarind and palm sugar go in at the end and push it past condiment into jam — it is spread on toast in Bangkok as readily as it is stirred into tom yum."
      },
      {
        "name": "XO sauce",
        "facets": {
          "region": [
            "Hong Kong"
          ],
          "chilli": [
            "dried chillies",
            "the smallest thing in the jar"
          ],
          "method": [
            "fried in oil",
            "every ingredient shredded by hand first"
          ],
          "add": [
            "garlic",
            "dried seafood",
            "dried scallop"
          ],
          "form": [
            "oil with solids in it",
            "shredded",
            "spooned rather than poured",
            "weeks in the fridge"
          ]
        },
        "note": "Invented in a Tsim Sha Tsui hotel dining room in the 1980s and named after extra-old cognac purely to say expensive — there is no brandy in it. Chilli is the cheapest thing in the jar and the least of the point: the dried scallop is the point, with dried shrimp and Jinhua ham shredded in behind it."
      },
      {
        "name": "Crema di peperoncino",
        "facets": {
          "region": [
            "Italy",
            "Calabria"
          ],
          "chilli": [
            "fresh chillies",
            "local Calabrian varieties"
          ],
          "method": [
            "pounded raw",
            "minced fine"
          ],
          "add": [
            "nothing else",
            "salt"
          ],
          "form": [
            "a paste",
            "smooth",
            "sealed under oil",
            "a year"
          ]
        },
        "note": "Sambal oelek with olive oil poured over it, arrived at independently at the other end of the world — minced fine, salted, packed into a jar and covered. The oil is doing two jobs, keeping air off the chilli and carrying it onto bread. Take the same chilli into pork fat instead and you have nduja, which is a salami rather than a condiment."
      },
      {
        "name": "Awaze",
        "facets": {
          "region": [
            "Ethiopia"
          ],
          "chilli": [
            "chilli already ground",
            "berbere rather than plain chilli"
          ],
          "method": [
            "stirred from a dry blend",
            "no heat at any point"
          ],
          "add": [
            "garlic",
            "a spice",
            "rue"
          ],
          "form": [
            "a paste",
            "loose",
            "made fresh each time",
            "days"
          ]
        },
        "note": "The inversion of everything else here. The keepable thing is berbere — dried chilli ground with a dozen spices, which lives in the cupboard — and awaze is what you make from it in five minutes when a sauce is needed: loosened with tej or wine, sharpened with garlic, ginger and rue. Eritrean kitchens make the same bowl. The preserving was done long before the condiment was."
      }
    ],
    "notes": [
      {
        "title": "On what stops it spoiling",
        "body": "Five things are doing the work in these jars, and most dishes use two of them. Salt is under all of it, and in ajika it is the whole answer — enough of it to make the jar uninhabitable, with no oil, no vinegar and no ferment anywhere near. Oil works by exclusion, since nothing spoils under a layer of fat: that is what the film on harissa, shatta, biber salçası and crema di peperoncino is for, and what the whole medium is in the four fried ones. Fermentation acidifies the jar first and then lives in it, over a few days for shatta and over years for doubanjiang and gochujang. Poured-in acid does the same job faster and with less to show for it. And biber salçası simply removes the water. Three dishes sit outside all of it: ají amarillo paste goes in the freezer, zhoug is eaten inside a fortnight because coriander leaf will not keep however much salt you use, and awaze is mixed to order from a powder that was preserved months earlier."
      },
      {
        "title": "On paste and oil",
        "body": "The form decides where the condiment enters the meal. The oils are finishing seasonings, spooned over food that is already cooked — chilli crisp on rice, salsa macha over a fried egg, XO on plain greens. Most of the pastes are cooking ingredients that go in near the start: doubanjiang is fried in oil before anything else touches the wok, gochujang is stirred into stew, biber salçası goes in with the onions. The exceptions are the ones eaten exactly as they are — zhoug, awaze, shatta — which stay at the table because heat would take away the only thing they have."
      },
      {
        "title": "On depth",
        "body": "Only chilli crisp sits under anything, and it earns it: it is chilli oil with the frying left in the jar rather than strained out. Everything else is one move from the base and belongs at the same depth. Sambal oelek and crema di peperoncino are the same idea — fresh chilli ground with salt and kept — reached at opposite ends of the world by people with no knowledge of each other, and so are chilli crisp and salsa macha. Harissa and shatta look identical in a jar and are not related at all. Siblings, all of them."
      },
      {
        "title": "On the ones next door",
        "body": "Thin any of the raw pastes with vinegar until it pours and you get the bottled hot sauces — sriracha is fermented chilli and garlic blended smooth and sweetened, piri-piri is the same idea with lemon, and Tabasco is a salt-fermented mash aged three years in oak and then cut with vinegar. They are the same family at a different viscosity. In the other direction, berbere and gochugaru are dry, and so are ingredients here rather than dishes — berbere only becomes a condiment once it is wetted down into awaze."
      }
    ],
    "sources": [
      {
        "label": "Sambal (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Sambal"
      },
      {
        "label": "Zhug (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Zhug"
      },
      {
        "label": "Ajika (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Ajika"
      },
      {
        "label": "Harissa (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Harissa"
      },
      {
        "label": "Salça — Turkish pepper paste (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Sal%C3%A7a"
      },
      {
        "label": "Shatta (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Shatta_(condiment)"
      },
      {
        "label": "Doubanjiang (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Doubanjiang"
      },
      {
        "label": "Sourcing Pixian doubanjiang (The Mala Market)",
        "url": "https://blog.themalamarket.com/pixian-chili-bean-paste-douban-jiang/"
      },
      {
        "label": "Gochujang (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Gochujang"
      },
      {
        "label": "Onggi and the jangdokdae (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Onggi"
      },
      {
        "label": "Chili oil (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Chili_oil"
      },
      {
        "label": "Salsa macha (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Salsa_macha"
      },
      {
        "label": "Nam phrik (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Nam_phrik"
      },
      {
        "label": "XO sauce (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/XO_sauce"
      },
      {
        "label": "Berbere (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Berbere"
      },
      {
        "label": "Ají amarillo — Capsicum baccatum (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Capsicum_baccatum"
      }
    ],
    "yours": [
      "chilli oil",
      "chili oil",
      "chilli crisp",
      "chilli paste",
      "chilli sauce",
      "hot sauce",
      "sambal",
      "harissa",
      "gochujang",
      "doubanjiang",
      "zhoug",
      "salsa macha",
      "xo sauce",
      "shatta"
    ]
  },
  {
    "slug": "compound-butter",
    "name": "Compound butter",
    "standfirst": "Butter is the constant. What separates these sixteen is the thing worked into it, whether that thing goes in raw or is cooked first, and what the butter is then asked to do — melt on a steak, be spread cold, or do the frying itself.",
    "root": "Butter, softened",
    "facets": [
      {
        "id": "aromatic",
        "label": "Aromatic"
      },
      {
        "id": "prep",
        "label": "Worked in"
      },
      {
        "id": "form",
        "label": "Form"
      },
      {
        "id": "use",
        "label": "Used"
      },
      {
        "id": "region",
        "label": "Region"
      }
    ],
    "nestings": [
      {
        "label": "By what goes in",
        "by": [
          "aromatic",
          "prep",
          "use"
        ]
      },
      {
        "label": "By how it goes in",
        "by": [
          "prep",
          "use",
          "aromatic"
        ]
      },
      {
        "label": "By region",
        "by": [
          "region",
          "aromatic"
        ]
      }
    ],
    "dishes": [
      {
        "name": "Beurre maître d'hôtel",
        "facets": {
          "region": [
            "France"
          ],
          "aromatic": [
            "herb",
            "parsley",
            "lemon"
          ],
          "prep": [
            "raw",
            "chopped fine"
          ],
          "form": [
            "chilled log",
            "sliced into coins"
          ],
          "use": [
            "melted on",
            "grilled steak"
          ]
        },
        "note": "The default. Parsley, lemon, salt, pepper — every other butter here is this same decision answered differently."
      },
      {
        "name": "Beurre Colbert",
        "parent": "Beurre maître d'hôtel",
        "facets": {
          "region": [
            "France"
          ],
          "aromatic": [
            "herb",
            "parsley",
            "lemon",
            "tarragon",
            "meat glaze"
          ],
          "prep": [
            "raw",
            "chopped fine",
            "meat glaze beaten in"
          ],
          "form": [
            "chilled log",
            "sliced into coins"
          ],
          "use": [
            "melted on",
            "fried sole"
          ]
        },
        "note": "Escoffier states it as arithmetic: maître d'hôtel butter plus tarragon and melted meat glaze — glace de viande, not a stock. It descends from that butter, not from plain butter."
      },
      {
        "name": "Beurre de Montpellier",
        "facets": {
          "region": [
            "Languedoc"
          ],
          "aromatic": [
            "herb",
            "watercress",
            "chervil",
            "tarragon",
            "anchovy",
            "capers",
            "egg yolk"
          ],
          "prep": [
            "blanched first",
            "pounded to a paste",
            "sieved smooth"
          ],
          "form": [
            "soft",
            "bright green"
          ],
          "use": [
            "spread cold",
            "poached salmon"
          ]
        },
        "note": "Blanching is not seasoning. Thirty seconds in boiling water fixes the chlorophyll, which is the only reason this stays green on a cold buffet."
      },
      {
        "name": "Snail butter",
        "facets": {
          "region": [
            "Burgundy"
          ],
          "aromatic": [
            "garlic",
            "parsley",
            "shallot"
          ],
          "prep": [
            "raw",
            "pounded to a paste"
          ],
          "form": [
            "soft",
            "piped"
          ],
          "use": [
            "baked in",
            "the shell"
          ]
        },
        "note": "Beurre d'escargot, and the only one cooked inside its serving vessel — the shell holds butter against snail while the oven melts it."
      },
      {
        "name": "Kyiv butter",
        "facets": {
          "region": [
            "Ukraine"
          ],
          "aromatic": [
            "garlic",
            "dill",
            "parsley"
          ],
          "prep": [
            "raw",
            "chopped fine"
          ],
          "form": [
            "frozen hard"
          ],
          "use": [
            "sealed inside",
            "a chicken cutlet"
          ]
        },
        "note": "Frozen so it survives breading and the fryer. It is only a sauce for the two seconds after the cutlet is cut."
      },
      {
        "name": "Café de Paris butter",
        "facets": {
          "region": [
            "Switzerland"
          ],
          "aromatic": [
            "anchovy",
            "capers",
            "mustard",
            "tarragon",
            "curry powder",
            "brandy"
          ],
          "prep": [
            "steeped warm",
            "rested a day"
          ],
          "form": [
            "chilled log",
            "sliced into coins"
          ],
          "use": [
            "melted on",
            "grilled entrecôte"
          ]
        },
        "note": "Geneva, 1930s, and a guarded list of twenty-odd things. The warm steep and the day's rest are what make it read as one flavour rather than a heap."
      },
      {
        "name": "Anchovy butter",
        "facets": {
          "region": [
            "France"
          ],
          "aromatic": [
            "anchovy",
            "lemon"
          ],
          "prep": [
            "raw",
            "pounded to a paste"
          ],
          "form": [
            "chilled log",
            "sliced into coins"
          ],
          "use": [
            "spread cold",
            "toast"
          ]
        },
        "note": "Two ingredients and a mortar. The salt in the fish seasons the butter, so nothing else is added."
      },
      {
        "name": "Gentleman's Relish",
        "parent": "Anchovy butter",
        "facets": {
          "region": [
            "England"
          ],
          "aromatic": [
            "anchovy",
            "secret spice mix"
          ],
          "prep": [
            "raw",
            "pounded to a paste"
          ],
          "form": [
            "potted",
            "keeps for months"
          ],
          "use": [
            "spread cold",
            "hot buttered toast"
          ]
        },
        "note": "Anchovy butter taken further by the spice tin: anchovy at three fifths of the jar by weight, butter, and a mix kept secret since John Osborn made the first pot in 1828. Sold as a relish; it is a compound butter under the lid."
      },
      {
        "name": "Bone marrow butter",
        "facets": {
          "region": [
            "England"
          ],
          "aromatic": [
            "bone marrow",
            "parsley",
            "shallot"
          ],
          "prep": [
            "roasted first",
            "beaten in warm"
          ],
          "form": [
            "soft",
            "whipped"
          ],
          "use": [
            "melted on",
            "grilled steak"
          ]
        },
        "note": "One fat carrying another. Marrow has no structure of its own, so this melts to a puddle where a herb butter would hold a slick. The marrow-and-parsley pairing is a London chophouse habit."
      },
      {
        "name": "Beurre de homard",
        "facets": {
          "region": [
            "France"
          ],
          "aromatic": [
            "shellfish",
            "lobster shells",
            "coral"
          ],
          "prep": [
            "roasted first",
            "pounded with the butter",
            "melted gently",
            "strained into iced water"
          ],
          "form": [
            "set hard",
            "coral red"
          ],
          "use": [
            "stirred into",
            "a shellfish soup"
          ]
        },
        "note": "The aromatic is thrown away. Shells go in for colour and scent only, and the butter is poured through muslin into iced water, where it sets hard and coral red."
      },
      {
        "name": "Beurre aux algues",
        "facets": {
          "region": [
            "Brittany"
          ],
          "aromatic": [
            "seaweed",
            "dulse",
            "sea lettuce",
            "salt crystals"
          ],
          "prep": [
            "raw",
            "dried flakes crumbled in"
          ],
          "form": [
            "chilled log"
          ],
          "use": [
            "spread cold",
            "sourdough"
          ]
        },
        "note": "A Breton dairy answer to anchovy: the sea taste arrives as dried weed, so the butter takes on iodine and colour without taking on water."
      },
      {
        "name": "Miso butter",
        "facets": {
          "region": [
            "Japan"
          ],
          "aromatic": [
            "fermented paste",
            "miso"
          ],
          "prep": [
            "raw",
            "beaten smooth"
          ],
          "form": [
            "soft",
            "whipped"
          ],
          "use": [
            "melted on",
            "grilled corn"
          ]
        },
        "note": "Salt and glutamate already dissolved into a paste — nothing to chop, nothing to cook, which makes it the easiest of these to improvise. Hokkaido eats it on grilled corn."
      },
      {
        "name": "Harissa butter",
        "facets": {
          "region": [
            "modern kitchens"
          ],
          "aromatic": [
            "fermented paste",
            "harissa",
            "garlic",
            "caraway"
          ],
          "prep": [
            "raw",
            "beaten smooth"
          ],
          "form": [
            "chilled log",
            "sliced into coins"
          ],
          "use": [
            "melted on",
            "grilled lamb"
          ]
        },
        "note": "Chilli heat is fat-soluble, so butter spreads it evenly and blunts it — the same paste stirred into a broth would be twice as sharp. The paste is Tunisian; the butter is not. Tunisia cooks in olive oil, and this is a modern kitchen borrowing a jar, which is why recipe sites label it Tunisian and Moroccan by turns and neither is a home."
      },
      {
        "name": "Niter kibbeh",
        "facets": {
          "region": [
            "Horn of Africa"
          ],
          "aromatic": [
            "spice",
            "koseret",
            "besobela",
            "fenugreek",
            "garlic",
            "ginger"
          ],
          "prep": [
            "simmered in",
            "strained out"
          ],
          "form": [
            "clarified",
            "keeps unrefrigerated"
          ],
          "use": [
            "cooked with",
            "as the frying fat"
          ]
        },
        "note": "The one butter here that is not a garnish — tesmi in Tigrinya, and as Eritrean as it is Ethiopian. With the milk solids simmered off and strained away it keeps without a fridge and carries its spice into every wat cooked in it."
      },
      {
        "name": "Smen",
        "facets": {
          "region": [
            "Morocco"
          ],
          "aromatic": [
            "salt",
            "wild oregano"
          ],
          "prep": [
            "clarified first",
            "salted heavily",
            "sealed in the pot",
            "left to age"
          ],
          "form": [
            "potted",
            "keeps for years"
          ],
          "use": [
            "cooked with",
            "a tagine"
          ]
        },
        "note": "The aromatic is time. The butter is boiled and skimmed clear before anything else happens; then months to years under salt turn it blue-cheese pungent, and a spoonful seasons a whole couscous."
      },
      {
        "name": "Honey butter",
        "facets": {
          "region": [
            "United States"
          ],
          "aromatic": [
            "honey",
            "cinnamon"
          ],
          "prep": [
            "raw",
            "beaten smooth"
          ],
          "form": [
            "soft",
            "whipped"
          ],
          "use": [
            "spread cold",
            "hot cornbread"
          ]
        },
        "note": "Proof that the family is a method and not a seasoning — whip anything soluble into soft butter and let it firm up again."
      }
    ],
    "notes": [
      {
        "title": "On the first fork",
        "body": "Raw or cooked first is the decision the rest hang off. A raw aromatic keeps its edge and its colour, and the butter is only a carrier — parsley, garlic, miso, harissa. Cook it first and the butter becomes an extractor: shells give up colour, marrow gives up fat, spices give up oil-soluble scent, and in the two extreme cases the aromatic is strained back out and thrown away."
      },
      {
        "title": "Where a butter stops and a sauce starts",
        "body": "Beurre blanc and beurre rouge are not in this family. They are emulsions whisked to order into a hot reduction and served warm within the hour. A compound butter is solid, keeps, and travels to the plate as a slice or a spoonful. The test is whether you could still cut it tomorrow."
      },
      {
        "title": "Butter that keeps",
        "body": "Niter kibbeh and smen answer a different question from the rest, and they start the same way: melt the butter and take out the milk solids, which are the part that spoils. Niter kibbeh stops there — the spices simmer in the fat and are strained away with the solids, and what is left keeps on a shelf because there is nothing in it left to go off. Smen is then packed with salt and shut in a pot, and lactic fermentation does the rest, which is why it goes somewhere in flavour that a clarified butter never does. Both are cooked with rather than melted on: the seasoning was never the point."
      },
      {
        "title": "On depth",
        "body": "Only two dishes sit a level down, and for different reasons. Colbert is the arithmetic case — Escoffier writes it as maître d'hôtel butter plus tarragon and melted meat glaze, so the descent is stated in the recipe. Gentleman's Relish has no such recipe to quote: the formula has been a trade secret since 1828. It is read as an anchovy butter from what is in the jar — anchovy pounded into butter, spread cold on toast — with a spice mix on top of it. Everything else is one move from soft butter and belongs at the same depth, however much a neater tree would like otherwise."
      }
    ],
    "sources": [
      {
        "label": "Compound butter (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Compound_butter"
      },
      {
        "label": "Beurre maître d'hôtel",
        "url": "https://en.wikipedia.org/wiki/Beurre_ma%C3%AEtre_d%27h%C3%B4tel"
      },
      {
        "label": "Colbert butter (Escoffier, Le Guide Culinaire)",
        "url": "https://culinaryexplorer.app/escoffier/141-colbert-butter"
      },
      {
        "label": "Café de Paris sauce",
        "url": "https://en.wikipedia.org/wiki/Caf%C3%A9_de_Paris_sauce"
      },
      {
        "label": "Gentleman's Relish",
        "url": "https://en.wikipedia.org/wiki/Gentleman%27s_Relish"
      },
      {
        "label": "Niter kibbeh",
        "url": "https://en.wikipedia.org/wiki/Niter_kibbeh"
      },
      {
        "label": "Smen",
        "url": "https://en.wikipedia.org/wiki/Smen"
      },
      {
        "label": "Harissa",
        "url": "https://en.wikipedia.org/wiki/Harissa"
      },
      {
        "label": "Escargot",
        "url": "https://en.wikipedia.org/wiki/Escargot"
      }
    ],
    "yours": [
      "compound butter",
      "garlic butter",
      "herb butter",
      "maître d'hôtel",
      "anchovy butter",
      "miso butter",
      "marrow butter",
      "café de paris",
      "niter kibbeh",
      "tesmi"
    ]
  },
  {
    "slug": "cured-fish-preserve",
    "name": "Salted and preserved fish",
    "standfirst": "Every one of these starts from the same problem: more fish comes ashore in a week than a coast can eat, and none of it lasts three days. Salt pulls the water out. Cold air takes what the salt leaves. Smoke dries the surface and coats it in phenols. And in some places the rot is not shut out at all but let in early and steered — with salt heavy enough that only the halophiles can work, with a brine deliberately too weak, or with a bed of cooked rice to feed the organism you want — so that it gets there before the dangerous ones do. What separates them is which of those does the work, how long it is given, and whether what comes out is dinner or the thing you season dinner with.",
    "root": "A fish landed faster than it can be eaten · salt · air · smoke · time",
    "facets": [
      {
        "id": "preserve",
        "label": "What keeps it"
      },
      {
        "id": "fish",
        "label": "The fish"
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
        "label": "By what keeps it",
        "by": [
          "preserve",
          "keep",
          "end"
        ]
      },
      {
        "label": "By food or seasoning",
        "by": [
          "end",
          "preserve",
          "fish"
        ]
      },
      {
        "label": "By region",
        "by": [
          "region",
          "preserve"
        ]
      }
    ],
    "dishes": [
      {
        "name": "Bacalhau",
        "facets": {
          "region": [
            "Portugal"
          ],
          "preserve": [
            "salted",
            "dry salt not brine",
            "then air-dried hard"
          ],
          "fish": [
            "cod",
            "gutted",
            "split down the back"
          ],
          "keep": [
            "three weeks under salt",
            "then weeks drying in cold air",
            "stable at room temperature"
          ],
          "end": [
            "eaten as food",
            "soaked back first",
            "three days of changed water"
          ]
        },
        "note": "The salt is not seasoning and the drying is not cooking. Between them they take the water below what any spoilage bacterium can work in, and everything you afterwards do to a salt cod is an argument about how to put that water back. Portugal eats more of it than anyone and lands almost none: the cod comes down from Norway and Iceland."
      },
      {
        "name": "Tørrfisk",
        "facets": {
          "region": [
            "Norway",
            "Lofoten"
          ],
          "preserve": [
            "dried",
            "no salt at all",
            "cold wind off the sea"
          ],
          "fish": [
            "cod",
            "gutted",
            "hung whole in pairs"
          ],
          "keep": [
            "three months on the racks",
            "February to May",
            "never warm enough to spoil"
          ],
          "end": [
            "eaten as food",
            "soaked back first",
            "beaten soft with a mallet"
          ]
        },
        "note": "Lofoten in February is a freeze-dryer — cold enough to stop rot and dry enough to pull the water out through it. Where the winter is milder you have to buy the same effect with salt instead. That purchase is exactly what bacalhau is."
      },
      {
        "name": "Haam yu",
        "facets": {
          "region": [
            "China",
            "Guangdong"
          ],
          "preserve": [
            "salted",
            "dry salt not brine",
            "then sun-dried hard"
          ],
          "fish": [
            "mackerel",
            "split down the back",
            "laid open in one piece"
          ],
          "keep": [
            "days under salt",
            "then days on the roof",
            "hangs unwrapped in the shop"
          ],
          "end": [
            "eaten as food",
            "cooked first",
            "steamed on top of pork"
          ]
        },
        "note": "The salted branch is not a European invention. South China has dry-salted and sun-dried its mackerel and threadfin for as long as Portugal has salted cod, and the result is not soaked back at all: a thumb-sized piece is laid on a pork patty and steamed, and it salts the whole dish from there. Written 咸鱼, xiányú in Mandarin."
      },
      {
        "name": "Acciughe sotto sale",
        "facets": {
          "region": [
            "Italy",
            "Liguria"
          ],
          "preserve": [
            "salted",
            "dry salt not brine",
            "pressed under a weight"
          ],
          "fish": [
            "anchovies",
            "heads pulled off by hand",
            "the gut comes away with the head"
          ],
          "keep": [
            "a year in the barrel",
            "a cool cellar",
            "the brine that rises kept over them"
          ],
          "end": [
            "eaten as food",
            "soaked back first",
            "then filleted by hand"
          ]
        },
        "note": "Twelve months under salt is not storage, it is the process. Enzymes already in the fish break its protein down into free amino acids — the fillet goes from salty to savoury — and it is the same reaction that makes every fish sauce on this table. Rinsed and filleted it goes into the pan as an ingredient rather than a condiment; the condiment is what runs out of the same barrel. Spain salts the same fish on the Cantabrian coast."
      },
      {
        "name": "Colatura di alici",
        "parent": "Acciughe sotto sale",
        "facets": {
          "region": [
            "Italy",
            "Cetara"
          ],
          "preserve": [
            "salted",
            "dry salt not brine",
            "pressed under a weight",
            "the liquid drawn off"
          ],
          "fish": [
            "anchovies",
            "heads pulled off by hand",
            "the gut comes away with the head"
          ],
          "keep": [
            "a year in the barrel",
            "a cool cellar",
            "tapped through a hole in the base"
          ],
          "end": [
            "used as seasoning",
            "kept as a liquid",
            "a spoonful over hot pasta"
          ]
        },
        "note": "Anchovies under salt plus one decision: instead of eating the fillets you tap the barrel and keep what ran out of them. Rome tapped the same liquid off the same coast — though with the guts left in, which is not what happens here. Whether the line ever actually broke is a story Cetara tells better than the record does: the first hard evidence is a Cistercian house on this coast in the thirteenth century, and everything before that is a gap."
      },
      {
        "name": "Bottarga",
        "facets": {
          "region": [
            "Italy",
            "Sardinia"
          ],
          "preserve": [
            "salted",
            "dry salt not brine",
            "pressed under a weight",
            "then air-dried"
          ],
          "fish": [
            "grey mullet roe",
            "the sac lifted out whole",
            "salted inside its membrane"
          ],
          "keep": [
            "a week under salt",
            "then three weeks in the air",
            "shaded and turned"
          ],
          "end": [
            "used as seasoning",
            "kept as a dry solid",
            "grated over pasta"
          ]
        },
        "note": "The only one here made from roe rather than flesh, and the membrane is the whole game — it holds the eggs in one slab while salt and weight take the water out. Break it and you have a wet mess going off. Sardinia's is grey mullet; Sicily cures tuna roe the same way and gets something coarser and darker."
      },
      {
        "name": "Garum",
        "facets": {
          "region": [
            "Roman Mediterranean",
            "Baetica"
          ],
          "preserve": [
            "fermented",
            "salt heavy enough to stop rot",
            "guts left in",
            "sun-warmed in open vats"
          ],
          "fish": [
            "small oily fish",
            "left whole",
            "guts and all"
          ],
          "keep": [
            "two to three months",
            "open to the sun",
            "stirred as it liquefies"
          ],
          "end": [
            "used as seasoning",
            "kept as a liquid",
            "cut with wine before use"
          ]
        },
        "note": "Salt and soy at once for a table that had neither. Small fish and fish guts left under salt in the sun until they dissolved — sneered at as a stink by Roman moralists and shipped in amphorae from Spain to Britain regardless."
      },
      {
        "name": "Nước mắm",
        "facets": {
          "region": [
            "Vietnam",
            "Phú Quốc"
          ],
          "preserve": [
            "fermented",
            "salt heavy enough to stop rot",
            "guts left in",
            "layered in wooden vats"
          ],
          "fish": [
            "anchovies",
            "left whole",
            "guts and all"
          ],
          "keep": [
            "nine months to two years",
            "tropical heat",
            "the liquid poured back over the top"
          ],
          "end": [
            "used as seasoning",
            "kept as a liquid",
            "let down into nước chấm"
          ]
        },
        "note": "Not descended from garum and not its ancestor. Anchovies salted whole in a wooden vat can only ever end up as this liquid — Vietnam went on making it while Europe forgot how for a thousand years."
      },
      {
        "name": "Jeotgal",
        "facets": {
          "region": [
            "Korea"
          ],
          "preserve": [
            "fermented",
            "salt heavy enough to stop rot",
            "sealed in a crock",
            "under its own brine"
          ],
          "fish": [
            "anchovies",
            "left whole",
            "guts and all"
          ],
          "keep": [
            "three months in the crock",
            "a year for the best",
            "buried below the frost"
          ],
          "end": [
            "eaten as food",
            "eaten as it is",
            "a small dish beside rice"
          ]
        },
        "note": "Anchovy jeot is one crock doing two jobs. The solids come out to be eaten in a little dish beside the rice, and the liquid is drawn off separately and given its own name. Shrimp jeot — saeujeot — is the other common one, and that goes into the kimchi whole."
      },
      {
        "name": "Aekjeot",
        "parent": "Jeotgal",
        "facets": {
          "region": [
            "Korea"
          ],
          "preserve": [
            "fermented",
            "salt heavy enough to stop rot",
            "sealed in a crock",
            "the liquid drawn off"
          ],
          "fish": [
            "anchovies",
            "left whole",
            "guts and all"
          ],
          "keep": [
            "a year in the crock",
            "the solids lifted out first",
            "the liquid keeps for years"
          ],
          "end": [
            "used as seasoning",
            "kept as a liquid",
            "stirred into kimchi paste"
          ]
        },
        "note": "Jeotgal plus one decision, and it is colatura's decision exactly: leave the fillets and keep what ran out of them. Korea does not treat the two as rival products the way Italy does — one crock in the yard yields the side dish and the salt for the kimchi both."
      },
      {
        "name": "Belacan",
        "facets": {
          "region": [
            "Malaysia"
          ],
          "preserve": [
            "fermented",
            "salt heavy enough to stop rot",
            "pounded to a paste",
            "then sun-dried in blocks"
          ],
          "fish": [
            "tiny shrimp",
            "left whole",
            "shell and all"
          ],
          "keep": [
            "salted for a day",
            "then weeks drying in the sun",
            "pounded down between dryings"
          ],
          "end": [
            "used as seasoning",
            "kept as a paste",
            "toasted before it goes in"
          ]
        },
        "note": "The same bet as a fish sauce, made with something too small to fillet and then stopped short of liquid. Krill and tiny shrimp are salted, left to break down, and pounded and dried in the sun over weeks until the mass will hold a brick shape. Indonesia calls it terasi and Thailand kapi. The block is always toasted before use, which is the smell that gives a street away."
      },
      {
        "name": "Funazushi",
        "facets": {
          "region": [
            "Japan",
            "Shiga"
          ],
          "preserve": [
            "fermented",
            "salt heavy enough to stop rot",
            "then packed in cooked rice",
            "weighted under a lid"
          ],
          "fish": [
            "nigorobuna carp",
            "gutted through the gills",
            "the roe left in"
          ],
          "keep": [
            "a year under salt",
            "then a year packed in rice",
            "some barrels run to three"
          ],
          "end": [
            "eaten as food",
            "eaten as it is",
            "sliced thin across the belly"
          ]
        },
        "note": "The rice is not there to be eaten, it is there to be eaten by lactobacilli, which turn its starch into acid until the barrel is too sour for anything dangerous to live in. That is a different way of steering a ferment from every other one here: not how much salt you use but what you feed the microbe you want. Sushi began at this lake as a way of keeping a carp for a year, and the rice was thrown away."
      },
      {
        "name": "Guedj",
        "facets": {
          "region": [
            "Senegal"
          ],
          "preserve": [
            "fermented",
            "salt heavy enough to stop rot",
            "salt only after it has started",
            "then sun-dried hard"
          ],
          "fish": [
            "catfish",
            "gutted",
            "scored to the bone"
          ],
          "keep": [
            "a few days before the salt",
            "then a week in the sun",
            "keeps months in the market"
          ],
          "end": [
            "used as seasoning",
            "kept as a dry solid",
            "a knob dropped in the pot"
          ]
        },
        "note": "Fermentation first and salt second, which is the reverse of the European side of this table: the fish is left to start on its own for a few days and only then buried in salt and dried hard. It is why a pot of thieboudienne tastes of the sea long after the fish in it has been eaten. Capitaine is used as often as catfish, and the Gambia makes the same thing."
      },
      {
        "name": "Fesikh",
        "facets": {
          "region": [
            "Egypt"
          ],
          "preserve": [
            "fermented",
            "salt heavy enough to stop rot",
            "salt only after it has started",
            "then sealed in the barrel"
          ],
          "fish": [
            "grey mullet",
            "left ungutted",
            "fat from the brackish water"
          ],
          "keep": [
            "days in the sun to start",
            "then forty days in the barrel",
            "opened in spring"
          ],
          "end": [
            "eaten as food",
            "eaten as it is",
            "torn up with raw onion"
          ]
        },
        "note": "Guedj's move made into dinner rather than a seasoning: mullet left in the sun until it has begun, then packed in salt in a barrel that is sealed and not opened for six weeks. Eaten once a year at Sham el-Nessim, and the one dish here that reliably sends people to hospital — the salt has to be heavy enough and the barrel tight enough, or botulinum gets the room instead of the halophiles."
      },
      {
        "name": "Surströmming",
        "facets": {
          "region": [
            "Sweden",
            "the Baltic coast"
          ],
          "preserve": [
            "fermented",
            "salt too weak to stop it",
            "left open in the barrel",
            "canned while still working"
          ],
          "fish": [
            "Baltic herring",
            "gutted",
            "small and lean"
          ],
          "keep": [
            "a month in the barrel",
            "then sealed into tins",
            "goes on fermenting on the shelf"
          ],
          "end": [
            "eaten as food",
            "eaten as it is",
            "rolled into flatbread"
          ]
        },
        "note": "A brine deliberately too weak to sterilise. It lets one bacterium work while keeping the dangerous ones out, and canning does not stop it — the tin bulges because the fish inside is still going. Open it under water and outdoors, then roll it into thin flatbread with onion and potato."
      },
      {
        "name": "Shiokara",
        "facets": {
          "region": [
            "Japan",
            "Hokkaido"
          ],
          "preserve": [
            "fermented",
            "salt too weak to stop it",
            "its own liver stirred back in",
            "days not months"
          ],
          "fish": [
            "squid",
            "cut into strips",
            "the liver lifted out whole"
          ],
          "keep": [
            "three days to a month",
            "kept cold throughout",
            "eaten before it goes far"
          ],
          "end": [
            "eaten as food",
            "eaten as it is",
            "a spoonful alongside drink"
          ]
        },
        "note": "Ten per cent salt keeps nothing for long, so this is a ferment you eat while it is still young. The squid's own liver goes back in to supply the enzymes — the animal is made to digest itself on a schedule, and the cold of a Hokkaido winter is doing as much of the work as the salt."
      },
      {
        "name": "Hákarl",
        "facets": {
          "region": [
            "Iceland"
          ],
          "preserve": [
            "fermented",
            "no salt at all",
            "pressed under stones",
            "then hung in the wind"
          ],
          "fish": [
            "Greenland shark",
            "cut into blocks",
            "flesh loaded with urea"
          ],
          "keep": [
            "six weeks in a gravel pit",
            "then four months in a drying shed",
            "open to the sea air"
          ],
          "end": [
            "eaten as food",
            "eaten as it is",
            "cut into small cubes"
          ]
        },
        "note": "Greenland shark is poisonous fresh — its flesh carries urea and trimethylamine oxide instead of salt, to stay in balance with the sea it swims in. The pressing and the five months in the wind are a detoxification: the urea breaks down to ammonia and blows off, and the TMAO that would otherwise turn to trimethylamine in your gut goes with it. That the result also keeps is a side effect. Chased with brennivín, by long habit."
      },
      {
        "name": "Katsuobushi",
        "facets": {
          "region": [
            "Japan",
            "Makurazaki"
          ],
          "preserve": [
            "smoked",
            "simmered first",
            "smoked over oak again and again",
            "then grown with mould"
          ],
          "fish": [
            "skipjack tuna",
            "filleted into loins",
            "bones picked out"
          ],
          "keep": [
            "a month of smoke",
            "then months of mould scraped and regrown",
            "two years for the best"
          ],
          "end": [
            "used as seasoning",
            "kept as a dry solid",
            "shaved thin for dashi"
          ]
        },
        "note": "The hardest food in the world and the most worked: simmered, boned, smoked a dozen times over a month, then deliberately infected with a mould that is scraped off and grown back four times more. The mould eats the fat, which is why dashi comes out clear. It sits under smoke because the smoke does the drying, but the mould is a ferment — this is the one dish here that is two techniques at once."
      },
      {
        "name": "Maldive fish",
        "facets": {
          "region": [
            "Maldives"
          ],
          "preserve": [
            "smoked",
            "simmered first",
            "smoked over a low fire",
            "then sun-dried to a stone"
          ],
          "fish": [
            "skipjack tuna",
            "filleted into loins",
            "cut into four"
          ],
          "keep": [
            "days of smoke",
            "then weeks in the sun",
            "keeps years in a dry room"
          ],
          "end": [
            "used as seasoning",
            "kept as a dry solid",
            "pounded to a coarse dust"
          ]
        },
        "note": "Katsuobushi without the mould, arrived at independently on the other side of the Indian Ocean. Same fish, the same simmer in salted water, the same smoke — but the equatorial sun finishes in weeks what Japan spends two years on, and the result is pounded into the food rather than steeped and thrown away. Sri Lanka buys most of it and cooks it into everything."
      },
      {
        "name": "Kippers",
        "facets": {
          "region": [
            "Britain",
            "Northumberland"
          ],
          "preserve": [
            "smoked",
            "brined first",
            "cold smoke over oak",
            "never dried hard"
          ],
          "fish": [
            "herring",
            "split down the back",
            "laid open in one piece"
          ],
          "keep": [
            "half an hour in brine",
            "one night in cold smoke",
            "a week and no more"
          ],
          "end": [
            "eaten as food",
            "cooked first",
            "grilled for breakfast"
          ]
        },
        "note": "The odd one out. Half an hour of brine and a night of smoke buys days rather than years, and the smoke is kept below thirty degrees so the fish never cooks — preservation here is almost vestigial now that everyone has a fridge."
      },
      {
        "name": "Smoke-dried salmon",
        "facets": {
          "region": [
            "Pacific Northwest"
          ],
          "preserve": [
            "smoked",
            "no salt at all",
            "cold smoke for a week",
            "dried hard through"
          ],
          "fish": [
            "salmon",
            "filleted off the bone",
            "cut into thin strips"
          ],
          "keep": [
            "a day of drying first",
            "then a week in the smokehouse",
            "keeps through the winter"
          ],
          "end": [
            "eaten as food",
            "eaten as it is",
            "torn off in dry strips"
          ]
        },
        "note": "Salt was scarce on this coast and never needed. Salmon split thin, dried a day in the air and then held for a week in the cool smoke of a cedar smokehouse comes out hard as bark and carries a village through the winter between runs. It is the only one here that is smoke and nothing else, which is possible only because the strips are cut thin enough for the smoke to reach the middle before the middle goes off."
      },
      {
        "name": "Surume",
        "facets": {
          "region": [
            "Japan",
            "Hokkaido"
          ],
          "preserve": [
            "dried",
            "no salt at all",
            "sun rather than cold"
          ],
          "fish": [
            "squid",
            "slit open flat",
            "tentacles left on"
          ],
          "keep": [
            "a week outdoors",
            "on lines by the shore",
            "turned as it curls"
          ],
          "end": [
            "eaten as food",
            "cooked first",
            "grilled until it gives"
          ]
        },
        "note": "Nothing but squid and air. Squid is lean enough that drying alone will hold it — no salt, no smoke, no ferment — which is why it is among the cheapest preserved seafood in Asia and the one most likely to be eaten standing up with a beer. Hakodate hangs the most of it; Korea dries the same squid and calls it ojingeo."
      }
    ],
    "notes": [
      {
        "title": "On what actually preserves",
        "body": "Salt and drying are the same move made two ways: both take water away from the bacteria, and a cod in Lofoten and a cod in Portugal end up at the same dryness by different routes. Smoke is weaker than it looks — it dries the surface and lays down phenols on it, and on its own buys days, which is why every smoked fish here is brined, simmered or air-dried before it goes near the fire. Fermentation is the opposite bet entirely: rather than shutting all the microbes out, you let one in and rig the room in its favour. Salt heavy enough that only halophiles can work is the usual rig; a brine deliberately too weak is Sweden's; a bed of cooked rice, whose starch the lactobacilli turn to acid, is Shiga's; and Iceland uses no salt at all, letting the shark's own ammonia hold the pit against everything else. Katsuobushi runs two techniques at once — the smoke dries it, and then a mould is grown on it on purpose, which is a ferment under another name."
      },
      {
        "title": "On food and seasoning",
        "body": "The seasoning column is not a different technique, it is the same technique taken further. An anchovy at twelve months is a fillet you eat; the liquid drained off the same barrel at the same age is colatura, and a Korean crock gives up jeotgal and aekjeot in exactly the same way. What has happened in both is that protein has been broken down to free amino acids, glutamate chief among them, and past a certain point there is more savour in a spoonful than anybody wants in a mouthful. Garum, colatura, nước mắm, aekjeot, belacan and guedj are not preserved fish that failed. They are preserved fish that went all the way."
      },
      {
        "title": "On depth",
        "body": "Two dishes sit under another, and for the same reason: each is the same barrel plus one decision. Colatura is the anchovies under salt with the liquid tapped off instead of the fillets lifted out; aekjeot is that decision made in a Korean crock. Everything else stands at the same level. Garum is not colatura's parent and nước mắm is not its child — several coasts salted small fish in wooden vessels, and several coasts got the same liquid. Katsuobushi and Maldive fish are siblings by the same logic: one skipjack, one simmer, one smoke, and two islands that never compared notes."
      },
      {
        "title": "On what is not here",
        "body": "Gravlax, matjes, rollmops and mojama live in Raw and cured fish. The line runs at whether what you are holding is still, in any useful sense, fish. A gravlax is fresh salmon with a cure on it: you slice it and eat it. Nothing here is that. It is board-hard, or smoke-hard, or has been worked on by microbes for a season — soak it, beat it, grate it, grill it, or open the tin outdoors, but you do not simply slice it and hand it round."
      }
    ],
    "sources": [
      {
        "label": "Salted fish (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Salted_fish"
      },
      {
        "label": "Bacalhau",
        "url": "https://en.wikipedia.org/wiki/Bacalhau"
      },
      {
        "label": "Stockfish",
        "url": "https://en.wikipedia.org/wiki/Stockfish"
      },
      {
        "label": "Colatura di alici",
        "url": "https://en.wikipedia.org/wiki/Colatura_di_alici"
      },
      {
        "label": "Garum",
        "url": "https://en.wikipedia.org/wiki/Garum"
      },
      {
        "label": "Fish sauce",
        "url": "https://en.wikipedia.org/wiki/Fish_sauce"
      },
      {
        "label": "Bottarga",
        "url": "https://en.wikipedia.org/wiki/Bottarga"
      },
      {
        "label": "Katsuobushi",
        "url": "https://en.wikipedia.org/wiki/Katsuobushi"
      },
      {
        "label": "Maldive fish",
        "url": "https://en.wikipedia.org/wiki/Maldive_fish"
      },
      {
        "label": "Kipper",
        "url": "https://en.wikipedia.org/wiki/Kipper"
      },
      {
        "label": "Surströmming",
        "url": "https://en.wikipedia.org/wiki/Surstr%C3%B6mming"
      },
      {
        "label": "Hákarl",
        "url": "https://en.wikipedia.org/wiki/H%C3%A1karl"
      },
      {
        "label": "Jeotgal",
        "url": "https://en.wikipedia.org/wiki/Jeotgal"
      },
      {
        "label": "Shiokara",
        "url": "https://en.wikipedia.org/wiki/Shiokara"
      },
      {
        "label": "Dried shredded squid",
        "url": "https://en.wikipedia.org/wiki/Dried_shredded_squid"
      },
      {
        "label": "Narezushi",
        "url": "https://en.wikipedia.org/wiki/Narezushi"
      },
      {
        "label": "Shrimp paste",
        "url": "https://en.wikipedia.org/wiki/Shrimp_paste"
      },
      {
        "label": "Feseekh",
        "url": "https://en.wikipedia.org/wiki/Feseekh"
      },
      {
        "label": "Smoked salmon",
        "url": "https://en.wikipedia.org/wiki/Smoked_salmon"
      }
    ],
    "yours": [
      "salt cod",
      "bacalhau",
      "brandade",
      "stockfish",
      "anchovy",
      "anchovies",
      "colatura",
      "fish sauce",
      "nuoc mam",
      "bottarga",
      "katsuobushi",
      "dashi",
      "bonito",
      "jeot",
      "aekjeot",
      "maldive fish",
      "dried squid",
      "kipper",
      "cured fish",
      "salt fish",
      "haam yu",
      "belacan",
      "terasi",
      "shrimp paste",
      "funazushi",
      "narezushi",
      "fesikh",
      "guedj"
    ]
  },
  {
    "slug": "curry-paste",
    "name": "Curry paste",
    "standfirst": "Almost nobody cooks a curry from scratch at the stove. They make the base first — aromatics and spices beaten into a paste, or seeds ground to a powder — and the curry is what happens when that base meets fat and liquid. The bases look wildly unlike each other and are separated by very little: fresh chilli or dried, whether the seeds see a dry pan before the grinder, which aromatics carry the smell, and whether the thing ends up wet or dry.",
    "root": "Aromatics and spices pounded or ground into a base, before anything else goes in the pan",
    "facets": [
      {
        "id": "form",
        "label": "Form"
      },
      {
        "id": "chilli",
        "label": "Chilli"
      },
      {
        "id": "spice",
        "label": "Dry spice"
      },
      {
        "id": "backbone",
        "label": "Backbone"
      },
      {
        "id": "region",
        "label": "Region"
      }
    ],
    "nestings": [
      {
        "label": "By form",
        "by": [
          "form",
          "spice",
          "chilli"
        ]
      },
      {
        "label": "By chilli",
        "by": [
          "chilli",
          "spice",
          "form"
        ]
      },
      {
        "label": "By region",
        "by": [
          "region",
          "form"
        ]
      }
    ],
    "dishes": [
      {
        "name": "Green curry paste",
        "facets": {
          "form": [
            "pounded to a wet paste"
          ],
          "chilli": [
            "fresh chilli",
            "green bird's eye"
          ],
          "spice": [
            "whole seeds toasted first",
            "coriander seed",
            "cumin seed"
          ],
          "backbone": [
            "lemongrass",
            "galangal",
            "garlic",
            "shallot",
            "makrut lime zest",
            "coriander root",
            "shrimp paste"
          ],
          "region": [
            "Thailand"
          ]
        },
        "note": "The one Thai paste built on fresh chilli. The colour is the chilli's own and it browns within days, which is why green paste is the one nobody sensible buys in a jar."
      },
      {
        "name": "Red curry paste",
        "facets": {
          "form": [
            "pounded to a wet paste"
          ],
          "chilli": [
            "dried chilli",
            "soaked soft"
          ],
          "spice": [
            "whole seeds toasted first",
            "coriander seed",
            "cumin seed"
          ],
          "backbone": [
            "lemongrass",
            "galangal",
            "garlic",
            "shallot",
            "makrut lime zest",
            "coriander root",
            "shrimp paste"
          ],
          "region": [
            "Thailand"
          ]
        },
        "note": "Green paste with the chilli swapped fresh for dried, and nothing else moved. Dried chilli is deeper and less sharp, and it keeps — so this is the paste a household actually has."
      },
      {
        "name": "Panang paste",
        "parent": "Red curry paste",
        "facets": {
          "form": [
            "pounded to a wet paste"
          ],
          "chilli": [
            "dried chilli",
            "soaked soft"
          ],
          "spice": [
            "whole seeds toasted first",
            "coriander seed",
            "cumin seed"
          ],
          "backbone": [
            "lemongrass",
            "galangal",
            "garlic",
            "shallot",
            "makrut lime zest",
            "coriander root",
            "shrimp paste",
            "roasted peanut"
          ],
          "region": [
            "Thailand"
          ]
        },
        "note": "Red paste with roasted peanuts pounded into it — thicker, milder, and the reason a panang clings to the meat instead of pooling under it. It sits below red because it is genuinely red plus one thing."
      },
      {
        "name": "Massaman paste",
        "facets": {
          "form": [
            "pounded to a wet paste"
          ],
          "chilli": [
            "dried chilli",
            "soaked soft"
          ],
          "spice": [
            "whole seeds toasted first",
            "cinnamon",
            "clove",
            "green cardamom",
            "nutmeg"
          ],
          "backbone": [
            "lemongrass",
            "galangal",
            "garlic",
            "shallot",
            "shrimp paste",
            "roasted peanut"
          ],
          "region": [
            "Southern Thailand"
          ]
        },
        "note": "Not red paste plus warm spices. The warm spices came first, with Muslim traders out of Persia and India, and the Thai aromatics were pounded in around them — the lineage runs the other way."
      },
      {
        "name": "Kroeung",
        "facets": {
          "form": [
            "pounded to a wet paste"
          ],
          "chilli": [
            "no chilli"
          ],
          "spice": [
            "no dry spice at all"
          ],
          "backbone": [
            "lemongrass",
            "galangal",
            "makrut lime leaf",
            "fresh turmeric root",
            "garlic",
            "shallot"
          ],
          "region": [
            "Cambodia"
          ]
        },
        "note": "The Thai aromatics — lemongrass, galangal, garlic, shallot — without the chilli and without the seeds, and with fresh turmeric root and lime leaf where the Thai pastes use the zest. Heat and funk arrive later, as chilli in the pot and prahok at the end. Red kroeung is this plus dried chilli, added mostly for colour."
      },
      {
        "name": "Rempah",
        "facets": {
          "form": [
            "pounded to a wet paste",
            "fried until the oil splits"
          ],
          "chilli": [
            "dried chilli",
            "soaked soft"
          ],
          "spice": [
            "whole seeds toasted first",
            "coriander seed",
            "fennel seed",
            "cumin seed"
          ],
          "backbone": [
            "lemongrass",
            "galangal",
            "shallot",
            "garlic",
            "candlenut",
            "belacan"
          ],
          "region": [
            "Malaysia"
          ]
        },
        "note": "A rempah is not finished in the mortar. Frying it until the oil separates and pools around it — pecah minyak — is the step the whole dish rests on; a rempah that has not split tastes raw no matter how long the curry simmers."
      },
      {
        "name": "Bumbu",
        "facets": {
          "form": [
            "pounded to a wet paste",
            "fried until the oil splits"
          ],
          "chilli": [
            "fresh chilli",
            "long red chilli"
          ],
          "spice": [
            "whole seeds ground raw",
            "coriander seed"
          ],
          "backbone": [
            "lemongrass",
            "galangal",
            "shallot",
            "garlic",
            "candlenut",
            "fresh turmeric root",
            "terasi"
          ],
          "region": [
            "Indonesia"
          ]
        },
        "note": "Its neighbour across the strait, on fresh chilli and fresh turmeric root instead of dried. Bumbu dasar is sold in colours — red, yellow, white — which are the same paste with the chilli or the turmeric left out."
      },
      {
        "name": "Vindaloo masala",
        "facets": {
          "form": [
            "pounded to a wet paste",
            "let down with acid",
            "palm vinegar"
          ],
          "chilli": [
            "dried chilli",
            "soaked in the vinegar"
          ],
          "spice": [
            "whole seeds toasted first",
            "cumin seed",
            "black peppercorn",
            "clove",
            "cinnamon"
          ],
          "backbone": [
            "garlic",
            "ginger"
          ],
          "region": [
            "Goa"
          ]
        },
        "note": "Portuguese carne de vinha d'alhos — meat in wine and garlic — with the wine become palm vinegar and chilli joining the garlic. The acid is structural, not a seasoning: it is what lets a wet paste keep in a hot climate."
      },
      {
        "name": "Recado rojo",
        "facets": {
          "form": [
            "pounded to a wet paste",
            "let down with acid",
            "sour orange juice"
          ],
          "chilli": [
            "no chilli"
          ],
          "spice": [
            "whole seeds toasted first",
            "black peppercorn",
            "clove",
            "cumin seed",
            "Mexican oregano"
          ],
          "backbone": [
            "achiote seed",
            "garlic charred first"
          ],
          "region": [
            "Yucatán"
          ]
        },
        "note": "Maya achiote with the Spanish spice cabinet ground into it, sold in bricks in the market exactly as curry pastes are sold in Bangkok. Nobody copied anybody: acid plus a pounded base is what you do when there is no refrigeration."
      },
      {
        "name": "Garam masala",
        "facets": {
          "form": [
            "ground to a dry powder"
          ],
          "chilli": [
            "no chilli"
          ],
          "spice": [
            "whole seeds toasted first",
            "cinnamon",
            "clove",
            "black cardamom",
            "cumin seed"
          ],
          "backbone": [
            "no fresh aromatics"
          ],
          "region": [
            "North India"
          ]
        },
        "note": "The only base here that goes in at the end. It is a finishing perfume, not a foundation — the actual foundation of a north Indian curry is onion and ginger and garlic cooked down in the pan, which never passes through a mortar at all."
      },
      {
        "name": "Sambar podi",
        "facets": {
          "form": [
            "ground to a dry powder"
          ],
          "chilli": [
            "dried chilli",
            "roasted dry"
          ],
          "spice": [
            "whole seeds toasted first",
            "coriander seed",
            "fenugreek seed",
            "asafoetida"
          ],
          "backbone": [
            "curry leaf",
            "toor dal roasted in",
            "chana dal roasted in"
          ],
          "region": [
            "Tamil Nadu"
          ]
        },
        "note": "Lentils roasted and ground in with the spices, so the powder thickens as well as flavours. Nothing else in this family carries its own starch."
      },
      {
        "name": "Roasted curry powder",
        "facets": {
          "form": [
            "ground to a dry powder"
          ],
          "chilli": [
            "no chilli"
          ],
          "spice": [
            "whole seeds toasted first",
            "toasted until dark brown",
            "coriander seed",
            "cumin seed",
            "fennel seed"
          ],
          "backbone": [
            "curry leaf",
            "pandan leaf"
          ],
          "region": [
            "Sri Lanka"
          ]
        },
        "note": "Badapu thuna paha. The seeds go far past fragrant, to the colour of dark chocolate, and the curry leaf and pandan go into the pan with them. Heat is a separate powder — chilli is never blended in."
      },
      {
        "name": "Unroasted curry powder",
        "facets": {
          "form": [
            "ground to a dry powder"
          ],
          "chilli": [
            "no chilli"
          ],
          "spice": [
            "whole seeds ground raw",
            "coriander seed",
            "cumin seed",
            "fennel seed"
          ],
          "backbone": [
            "curry leaf",
            "pandan leaf"
          ],
          "region": [
            "Sri Lanka"
          ]
        },
        "note": "The same spices in the same proportions, never roasted. It goes into white curries — fish and vegetables cooked in coconut milk that should stay pale. One decision on one morning, and the island has two cuisines."
      },
      {
        "name": "Curry powder",
        "facets": {
          "form": [
            "ground to a dry powder"
          ],
          "chilli": [
            "dried chilli",
            "mild"
          ],
          "spice": [
            "whole seeds ground raw",
            "coriander seed",
            "turmeric",
            "fenugreek seed"
          ],
          "backbone": [
            "no fresh aromatics"
          ],
          "region": [
            "Britain"
          ]
        },
        "note": "An eighteenth-century convenience: what an Indian cook ground fresh and differently for every dish, pre-blended and sold in a tin. Being identical from dish to dish is the flaw and also exactly why it travelled further than anything else here."
      },
      {
        "name": "Curry roux",
        "parent": "Curry powder",
        "facets": {
          "form": [
            "ground to a dry powder",
            "stirred into a butter-and-flour roux"
          ],
          "chilli": [
            "dried chilli",
            "mild"
          ],
          "spice": [
            "whole seeds ground raw",
            "coriander seed",
            "turmeric",
            "fenugreek seed"
          ],
          "backbone": [
            "no fresh aromatics"
          ],
          "region": [
            "Japan"
          ]
        },
        "note": "Karē rū: the tin of powder cooked into a browned flour-and-butter roux. The dish arrived with the British navy in the 1870s as a thickened stew; the roux sold in a solid block came much later, in the twentieth century. The thickening is the point — Japanese curry is a gravy, and gravy is the one thing no pounded paste makes."
      },
      {
        "name": "Berbere",
        "facets": {
          "form": [
            "ground to a dry powder"
          ],
          "chilli": [
            "dried chilli",
            "sun-dried",
            "then roasted",
            "more chilli than spice"
          ],
          "spice": [
            "whole seeds toasted first",
            "fenugreek seed",
            "korarima",
            "ajwain"
          ],
          "backbone": [
            "dried garlic",
            "dried ginger",
            "besobela"
          ],
          "region": [
            "Ethiopia"
          ]
        },
        "note": "The only powder here where chilli is the bulk and the spices are the seasoning. Let it down with wine or water and it becomes awaze — the same blend as a paste, which is how short the distance between the two halves of this family really is."
      }
    ],
    "notes": [
      {
        "title": "On paste or powder",
        "body": "This is a storage decision before it is a flavour one. A paste can hold things that die on drying — lemongrass, galangal, fresh turmeric root, garlic, coriander root — and lasts a week. A powder can hold only what survives being dried, which means seeds and bark, and lasts a year. That is why the paste cuisines are built on stems and roots and the powder cuisines are built on seeds, and why the powders are the ones that got on ships."
      },
      {
        "title": "On toasting",
        "body": "Toasting seeds before grinding is not the same spice turned up. Raw ground seed is volatile and green and fades in the pot; toasted seed has browned, and tastes of the browning as much as of itself. Sri Lanka settles the argument by refusing to pick: the same three spices roasted dark for meat, the same three raw for anything cooked in coconut milk that should stay white."
      },
      {
        "title": "On frying the paste",
        "body": "A wet paste is unfinished until it has been fried. Malay cooks call it pecah minyak, when the oil separates and pools around the paste; Indian cooks call the equivalent bhuna; Thai cooks crack the coconut cream and fry the paste in the fat that breaks out of it. Three languages, one step, and in every one of them the cook can tell you the exact moment it happens."
      },
      {
        "title": "On the word curry",
        "body": "The word is European and only one entry here is genuinely a British invention. Curry powder and its descendant the Japanese roux are a small family inside this one — the roux really is the powder plus a roux, which is why it hangs beneath it, exactly as panang hangs beneath red paste. Those two are the only nestings on the page. Everything else has its own name in its own language and owes the tin nothing: rempah, bumbu, kroeung and recado are not versions of curry paste, they are what people did with a mortar."
      }
    ],
    "sources": [
      {
        "label": "Thai curry",
        "url": "https://en.wikipedia.org/wiki/Thai_curry"
      },
      {
        "label": "Kroeung",
        "url": "https://en.wikipedia.org/wiki/Kroeung"
      },
      {
        "label": "Bumbu (seasoning)",
        "url": "https://en.wikipedia.org/wiki/Bumbu_(seasoning)"
      },
      {
        "label": "Pecah minyak, frying a rempah until the oil splits",
        "url": "https://www.singaporeanmalaysianrecipes.com/pecah-minyak-rempah/"
      },
      {
        "label": "Vindaloo",
        "url": "https://en.wikipedia.org/wiki/Vindaloo"
      },
      {
        "label": "Garam masala",
        "url": "https://en.wikipedia.org/wiki/Garam_masala"
      },
      {
        "label": "Sri Lankan roasted curry powder",
        "url": "https://www.theflavorbender.com/sri-lankan-roasted-curry-powder/"
      },
      {
        "label": "Curry powder",
        "url": "https://en.wikipedia.org/wiki/Curry_powder"
      },
      {
        "label": "Japanese curry",
        "url": "https://en.wikipedia.org/wiki/Japanese_curry"
      },
      {
        "label": "Recado rojo",
        "url": "https://en.wikipedia.org/wiki/Recado_rojo"
      },
      {
        "label": "Berbere",
        "url": "https://en.wikipedia.org/wiki/Berbere"
      }
    ],
    "yours": [
      "curry paste",
      "curry powder",
      "masala",
      "garam masala",
      "rempah",
      "bumbu",
      "green curry",
      "red curry",
      "massaman",
      "panang",
      "vindaloo",
      "sambar",
      "berbere",
      "achiote",
      "kroeung",
      "curry roux"
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
    "slug": "dip",
    "name": "Dip",
    "standfirst": "A dip is a texture before it is a recipe: something soft enough to give way under bread and salty enough that you keep going back. Four decisions make every one of them — what gets pulped, what fat carries it, what sour cuts the fat, and how far you take the pounding. Beat chickpeas into tahini sauce and you have hummus; beat burnt aubergine into the same sauce and you have mutabbal. One decision apart.",
    "root": "Something soft or softened · broken down with salt until it holds together · usually carried by a fat and cut by something sour · scooped up at the table with bread or rice",
    "facets": [
      {
        "id": "base",
        "label": "What is pulped"
      },
      {
        "id": "fat",
        "label": "The fat"
      },
      {
        "id": "acid",
        "label": "The sour"
      },
      {
        "id": "body",
        "label": "How far it is taken"
      },
      {
        "id": "region",
        "label": "Region"
      }
    ],
    "nestings": [
      {
        "label": "By what is pulped",
        "by": [
          "base",
          "fat",
          "acid"
        ]
      },
      {
        "label": "By smooth or chunky",
        "by": [
          "body",
          "acid",
          "base"
        ]
      },
      {
        "label": "By region",
        "by": [
          "region",
          "base"
        ]
      }
    ],
    "dishes": [
      {
        "name": "Tahini sauce",
        "facets": {
          "region": [
            "Levant"
          ],
          "base": [
            "a nut or seed",
            "sesame already ground to a paste",
            "nothing pulped into it at all"
          ],
          "fat": [
            "sesame paste",
            "the seed's own oil and no other",
            "no olive oil poured in"
          ],
          "acid": [
            "lemon juice",
            "poured in until the paste seizes solid"
          ],
          "body": [
            "taken smooth",
            "no motor touches it",
            "whisked thin enough to pour"
          ]
        },
        "note": "The plainest thing here and the one two others are built on: sesame paste, garlic crushed with salt, lemon, water. Thin enough to pour off a spoon, it is a sauce for fish and falafel on its own, and it is the medium that hummus and mutabbal are suspended in. The cold water that comes after the lemon is not an ingredient so much as a repair; see the note on what tahini does."
      },
      {
        "name": "Hummus",
        "parent": "Tahini sauce",
        "facets": {
          "region": [
            "Levant"
          ],
          "base": [
            "a cooked pulse",
            "chickpeas simmered soft with bicarbonate",
            "the skins slipped off by hand"
          ],
          "fat": [
            "sesame paste",
            "tahini beaten in until the whole thing pales",
            "olive oil poured over at the table"
          ],
          "acid": [
            "lemon juice",
            "beaten in with the tahini rather than after"
          ],
          "body": [
            "taken smooth",
            "no motor touches it",
            "run through a food mill rather than a blender"
          ]
        },
        "note": "Hummus bi tahina is the full name and it is an instruction: this is tahini sauce with chickpeas beaten into it. That is why it sits underneath rather than beside. The skins are the only thing standing between a good one and a great one, and a mill takes them out without beating air in."
      },
      {
        "name": "Mutabbal",
        "parent": "Tahini sauce",
        "facets": {
          "region": [
            "Levant"
          ],
          "base": [
            "a cooked vegetable",
            "aubergine burnt whole over a flame",
            "the flesh hung to drain its bitter water"
          ],
          "fat": [
            "sesame paste",
            "tahini beaten in",
            "yogurt as well in some houses"
          ],
          "acid": [
            "lemon juice",
            "enough to keep the tahini pale"
          ],
          "body": [
            "taken smooth",
            "no motor touches it",
            "mashed with a fork rather than blended"
          ]
        },
        "note": "The same sauce again with smoke instead of starch under it. Mutabbal means spiced or seasoned; what defines it against its neighbour is that the tahini goes in, and what defines it against hummus is that the flame does the cooking. Kept loose enough to swirl in the dish."
      },
      {
        "name": "Baba ganoush",
        "facets": {
          "region": [
            "Levant"
          ],
          "base": [
            "a cooked vegetable",
            "aubergine burnt whole over a flame",
            "the flesh chopped rather than pulped"
          ],
          "fat": [
            "olive oil",
            "poured over rather than beaten in",
            "no tahini in it"
          ],
          "acid": [
            "pomegranate molasses",
            "lemon juice alongside it"
          ],
          "body": [
            "left chunky",
            "no motor touches it",
            "chopped on a board with a knife"
          ]
        },
        "note": "In the West this name has been swallowed by mutabbal and now means the tahini one. At home it is the other fork off the same burnt aubergine: no sesame, a fruit acid instead of lemon alone, and knifework instead of a mortar, with tomato and green pepper cut through it — a salad rather than a paste."
      },
      {
        "name": "Kashk-e bademjan",
        "facets": {
          "region": [
            "Iran"
          ],
          "base": [
            "a cooked vegetable",
            "aubergine fried in oil until gold",
            "onion fried down to brown with it"
          ],
          "fat": [
            "a seed oil",
            "the aubergine drinks it in the pan",
            "dried mint bloomed in more oil and poured over"
          ],
          "acid": [
            "fermented whey",
            "kashk stirred through the pot",
            "more kashk drizzled on top"
          ],
          "body": [
            "left chunky",
            "no motor touches it",
            "pounded but stopped short of a paste"
          ]
        },
        "note": "Aubergine again with every other decision moved. The sour is kashk — drained yogurt fermented and dried to rocks, then let down with water — so the acid and a second fat arrive in the same spoonful, by fermentation rather than by fruit. Frying rather than burning means it tastes of oil and onion instead of smoke, and crushed walnuts go in for grit."
      },
      {
        "name": "Ajvar",
        "facets": {
          "region": [
            "Balkans",
            "Serbia",
            "North Macedonia"
          ],
          "base": [
            "a cooked vegetable",
            "red peppers roasted until the skins lift",
            "aubergine with them in some houses"
          ],
          "fat": [
            "a seed oil",
            "sunflower oil cooked into it over hours",
            "a last film on top to seal the jar"
          ],
          "acid": [
            "vinegar",
            "a splash at the very end",
            "it is the preservative as much as the seasoning"
          ],
          "body": [
            "left chunky",
            "no motor touches it",
            "minced through a hand grinder"
          ]
        },
        "note": "The only one here that is cooked after it is pulped and the only one made by the bucket in September, cooked down over hours until a spoon will stand in it. Everything else is a dish; ajvar is a winter store that happens to be eaten with bread."
      },
      {
        "name": "Nam phrik num",
        "facets": {
          "region": [
            "Thailand",
            "the north around Chiang Mai"
          ],
          "base": [
            "a cooked vegetable",
            "long green chillies charred in the embers",
            "shallots and garlic charred in their skins"
          ],
          "fat": [
            "no fat at all",
            "nothing poured in and nothing beaten in"
          ],
          "acid": [
            "lime juice",
            "a squeeze at the end",
            "fish sauce carries the salt instead"
          ],
          "body": [
            "left chunky",
            "no motor touches it",
            "pounded in a clay mortar"
          ]
        },
        "note": "The proof that the fat is optional and the pounding is not. Charring the chillies and aromatics whole before they meet the pestle is the same move as burning an aubergine over a flame — sweetness and smoke bought before anything is crushed. It is kept loose and picked up with sticky rice rather than bread."
      },
      {
        "name": "Muhammara",
        "facets": {
          "region": [
            "Levant"
          ],
          "base": [
            "a nut or seed",
            "walnuts pounded coarse",
            "roasted red pepper pounded in with them"
          ],
          "fat": [
            "the nut's own oil",
            "olive oil worked in as well",
            "no dairy and no sesame"
          ],
          "acid": [
            "pomegranate molasses",
            "lemon juice alongside it"
          ],
          "body": [
            "left chunky",
            "no motor touches it",
            "stopped while the walnut is still gritty"
          ]
        },
        "note": "Muhammara means reddened, and Aleppo is where it comes from. The walnut is the base rather than a garnish, which is why it is grainy in the mouth where its neighbours are creamy — and why the acid has to be pomegranate: lemon alone cannot get through that much oil. Breadcrumbs are stirred in to hold it together."
      },
      {
        "name": "Coconut chutney",
        "facets": {
          "region": [
            "South Asia",
            "Tamil Nadu",
            "Karnataka"
          ],
          "base": [
            "a nut or seed",
            "fresh coconut grated off the shell",
            "roasted gram dal ground in with it"
          ],
          "fat": [
            "the nut's own oil",
            "coconut oil heated for the tempering",
            "mustard seed and curry leaf fried in it"
          ],
          "acid": [
            "tamarind",
            "yogurt instead of it in some houses"
          ],
          "body": [
            "taken smooth",
            "no motor touches it",
            "ground on a wet stone with water"
          ]
        },
        "note": "The one here whose fat arrives only at the end and only hot, and the one where that fat is the seasoning rather than a garnish: mustard seed and curry leaf fried in coconut oil and tipped over the top so they crackle. Slackened to a scooping thickness and made fresh each morning, because coconut turns by evening."
      },
      {
        "name": "Ful medames",
        "facets": {
          "region": [
            "Egypt"
          ],
          "base": [
            "a cooked pulse",
            "fava beans simmered overnight in a narrow pot",
            "cumin ground over them"
          ],
          "fat": [
            "olive oil",
            "poured over at the table by the eater",
            "tahini stirred in in some houses"
          ],
          "acid": [
            "lemon juice",
            "squeezed on at the last moment"
          ],
          "body": [
            "left chunky",
            "no motor touches it",
            "crushed against the pot with a spoon"
          ]
        },
        "note": "Breakfast rather than a mezze, eaten hot, and the one dip nobody finishes making in the kitchen — the oil and lemon go on in front of you, and how far it gets mashed is decided by whoever is holding the bread. Half the beans usually stay whole."
      },
      {
        "name": "Tzatziki",
        "facets": {
          "region": [
            "Greece"
          ],
          "base": [
            "milk drained or soured",
            "yogurt strained through cloth",
            "cucumber grated and wrung out dry"
          ],
          "fat": [
            "the milk's own fat",
            "sheep yogurt at full fat",
            "olive oil poured over"
          ],
          "acid": [
            "the base's own souring",
            "a spoonful of vinegar in some houses"
          ],
          "body": [
            "left chunky",
            "no motor touches it",
            "the cucumber kept in shreds"
          ]
        },
        "note": "One of two here whose sourness is the base's own — feta does the same job for tirokafteri — so the spoonful of vinegar some houses add is a lift rather than a necessity. What is singular is the cucumber. Wringing it dry is the whole technique: skip it and the salt pulls the water out on the table instead and you get soup."
      },
      {
        "name": "Tirokafteri",
        "facets": {
          "region": [
            "Greece"
          ],
          "base": [
            "milk drained or soured",
            "feta broken up in the bowl",
            "a roasted chilli beaten in with it"
          ],
          "fat": [
            "the milk's own fat",
            "olive oil beaten in until it pales",
            "yogurt to let it down"
          ],
          "acid": [
            "the base's own souring",
            "the brine the feta came in",
            "lemon juice to lift it"
          ],
          "body": [
            "taken smooth",
            "a motor does the work",
            "beaten until it holds air"
          ]
        },
        "note": "Whipped feta, and the beating is the point — htipiti, its other name, simply means beaten. Nothing poured in could make feta this pale; it is air, the same trick as whipping butter, which is why it ends up spreadable rather than pourable. The cheese and its brine carry the sourness."
      },
      {
        "name": "Salsa huancaína",
        "facets": {
          "region": [
            "Peru",
            "named for Huancayo in the Andes"
          ],
          "base": [
            "milk drained or soured",
            "queso fresco crumbled in",
            "ají amarillo fried soft and blended with it"
          ],
          "fat": [
            "the milk's own fat",
            "evaporated milk to thin it",
            "a little oil to hold the blend together"
          ],
          "acid": [
            "barely any",
            "the salt of the cheese does that work instead"
          ],
          "body": [
            "taken smooth",
            "a motor does the work",
            "blended with soda crackers for body"
          ]
        },
        "note": "Fresh cheese standing in for yogurt on a continent with no yogurt tradition. It is thinned until it will pour over cold boiled potatoes as often as it is scooped — the same paste asked to be a sauce, which is what happens when you keep slackening a dip."
      },
      {
        "name": "Skordalia",
        "facets": {
          "region": [
            "Greece"
          ],
          "base": [
            "a starch",
            "potato boiled and passed through a ricer",
            "stale bread soaked and squeezed in other houses"
          ],
          "fat": [
            "olive oil",
            "worked in a thread at a time like mayonnaise",
            "walnuts or almonds pounded in on some islands"
          ],
          "acid": [
            "vinegar",
            "lemon juice instead of it in some houses"
          ],
          "body": [
            "taken smooth",
            "no motor touches it",
            "the garlic pounded to paste before anything else"
          ]
        },
        "note": "Named for the garlic and not for the potato, which tells you which one is the dish. The starch is only there to hold oil — it is what lets the thread of oil go in without splitting, and it leaves the thing stiff enough to stand a spoon in. Take it away and drip the oil into the garlic alone and you have Lebanese toum instead."
      },
      {
        "name": "Taramasalata",
        "facets": {
          "region": [
            "Greece"
          ],
          "base": [
            "cured fish roe",
            "salted carp or cod roe",
            "soaked bread or riced potato beaten in with it"
          ],
          "fat": [
            "olive oil",
            "beaten in drop by drop like mayonnaise",
            "a neutral oil in part so it does not fight the roe"
          ],
          "acid": [
            "lemon juice",
            "added by turns with the oil"
          ],
          "body": [
            "taken smooth",
            "a motor does the work",
            "beaten until it pales and doubles"
          ]
        },
        "note": "The only base here that is fish, and the only one where the base itself does the emulsifying: the roe's own proteins take the oil drop by drop the way an egg yolk does, where skordalia leans on starch to hold the same thread. That is why it ends up a mousse rather than a paste. The bread is a brake as much as a bulker — it stops the thing splitting."
      },
      {
        "name": "Guacamole",
        "facets": {
          "region": [
            "Mexico"
          ],
          "base": [
            "a raw fruit",
            "avocado scooped from the skin",
            "chilli and onion ground to a paste first"
          ],
          "fat": [
            "the fruit's own fat",
            "nothing poured in at all"
          ],
          "acid": [
            "lime juice",
            "it also holds off the browning"
          ],
          "body": [
            "left chunky",
            "no motor touches it",
            "mashed in a basalt molcajete"
          ]
        },
        "note": "The only one that goes in raw and has nothing poured in at all: coconut is raw too but takes hot oil over the top, and muhammara works olive oil into its walnuts. Here the fat is already in the flesh and stays there. Grinding the chilli and onion before the avocado goes in is the order that matters — afterwards you would only be bruising it, and the lumps are left in on purpose."
      }
    ],
    "notes": [
      {
        "title": "On the four decisions",
        "body": "What is pulped sets the flavour, but it is the other three that place the dish on a map. The fat is the carrier — sesame paste, olive oil, a seed oil, the fat already inside a walnut or an avocado, or none at all. The sour is what stops the fat being dull, and it is the most local decision of the four: lemon in the Levant, lime in Mexico and northern Thailand, vinegar in the Balkans, pomegranate in Aleppo, fermented whey in Iran — and in tzatziki and tirokafteri the sourness is already in the base, because milk sours itself, so the vinegar or lemon some houses add is a lift rather than the point. Burnt aubergine with tahini and lemon is mutabbal; fry that same aubergine instead and sour it with kashk and you are in Tehran; chop it rather than pound it and sour it with pomegranate molasses and it is baba ganoush. One vegetable, three decisions moved, three countries."
      },
      {
        "title": "On what tahini does",
        "body": "Sesame paste is oil with solids suspended in it, and no water. Stir anything watery into it — lemon juice, or plain water, it makes no difference which — and it seizes: the paste stiffens to something like plaster as the water pulls the solids together and the whole thing flips from oil holding solids to solids holding water. Keep going with cold water and it comes back, slack again but paler and thicker than it started, because the water is now scattered through it in droplets that scatter light with it. That seizing and recovery is the texture of hummus and of mutabbal, and it is why both are pale rather than beige. It is also why neither can be made properly by stirring everything together at once."
      },
      {
        "title": "On the mortar and the machine",
        "body": "Smooth or chunky is mostly a decision about the tool, and the tool is usually older than the recipe. Only three dips here let a motor near them. A basalt molcajete crushes against a rough face and leaves lumps, which is why guacamole has them. A stone mortar can be stopped anywhere between coarse and paste, which is how muhammara and nam phrik num stay grainy. Ajvar's hand grinder is a machine with no motor in it: it minces without whipping. A food mill takes the skins out and gives no air, which is what hummus wants. A spinning blade beats air in, which is what tirokafteri and taramasalata want and what ruins hummus. Air is one of the two things that will pale a dip; water beaten into tahini is the other."
      },
      {
        "title": "On depth",
        "body": "Only hummus and mutabbal sit underneath another dish, because both genuinely are tahini sauce plus a pulped thing — you make the sauce first and beat the chickpeas or the aubergine into it, and hummus bi tahina says so in its name. Everything else stands at the same level. Baba ganoush is not mutabbal with the tahini taken out: it is chopped rather than pounded and soured with pomegranate, a different dish from the same vegetable. Salsa huancaína is not a Peruvian tirokafteri, and coconut chutney is not an Indian muhammara. They are separate answers to the same question, and hanging one under the other would make the tree tidier and the claim false."
      },
      {
        "title": "On what is not here",
        "body": "Fresh things cut with a knife are salsas, not dips: pico de gallo, Turkish ezme, Ethiopian awaze fresca. The line is that a salsa is chopped and stays wet and separate, while a dip is broken down until it holds together and will sit on whatever you scoop it with — bread, sticky rice, a dosa, a tortilla chip. Toum is left out for the opposite reason — it is skordalia with the starch removed, garlic and oil and nothing pulped, which puts it among the emulsified sauces with aioli. And ful medames sits at the edge of the family on purpose: it is served hot, and it is the one that is still being made while you eat it."
      }
    ],
    "sources": [
      {
        "label": "Tahini",
        "url": "https://en.wikipedia.org/wiki/Tahini"
      },
      {
        "label": "Hummus",
        "url": "https://en.wikipedia.org/wiki/Hummus"
      },
      {
        "label": "Mutabbal and the eggplant appetizers",
        "url": "https://en.wikipedia.org/wiki/Eggplant_salads_and_appetizers"
      },
      {
        "label": "Baba ghanoush",
        "url": "https://en.wikipedia.org/wiki/Baba_ghanoush"
      },
      {
        "label": "Kashk bademjan",
        "url": "https://en.wikipedia.org/wiki/Kashk_bademjan"
      },
      {
        "label": "Ajvar",
        "url": "https://en.wikipedia.org/wiki/Ajvar"
      },
      {
        "label": "Nam phrik",
        "url": "https://en.wikipedia.org/wiki/Nam_phrik"
      },
      {
        "label": "Muhammara",
        "url": "https://en.wikipedia.org/wiki/Muhammara"
      },
      {
        "label": "Coconut chutney",
        "url": "https://en.wikipedia.org/wiki/Coconut_chutney"
      },
      {
        "label": "Ful medames",
        "url": "https://en.wikipedia.org/wiki/Ful_medames"
      },
      {
        "label": "Tzatziki",
        "url": "https://en.wikipedia.org/wiki/Tzatziki"
      },
      {
        "label": "Tirokafteri",
        "url": "https://en.wikipedia.org/wiki/Tirokafteri"
      },
      {
        "label": "Papa a la huancaína",
        "url": "https://en.wikipedia.org/wiki/Papa_a_la_huanca%C3%ADna"
      },
      {
        "label": "Skordalia",
        "url": "https://en.wikipedia.org/wiki/Skordalia"
      },
      {
        "label": "Taramasalata",
        "url": "https://en.wikipedia.org/wiki/Taramasalata"
      },
      {
        "label": "Guacamole",
        "url": "https://en.wikipedia.org/wiki/Guacamole"
      },
      {
        "label": "Kashk",
        "url": "https://en.wikipedia.org/wiki/Kashk"
      }
    ],
    "yours": [
      "hummus",
      "houmous",
      "hummus bi tahina",
      "tahini sauce",
      "taratur",
      "mutabbal",
      "moutabal",
      "mutabal",
      "baba ganoush",
      "baba ghanoush",
      "muhammara",
      "kashk-e bademjan",
      "kashk bademjan",
      "ajvar",
      "nam phrik num",
      "nam prik noom",
      "coconut chutney",
      "ful medames",
      "foul mudammas",
      "tzatziki",
      "whipped feta",
      "tirokafteri",
      "htipiti",
      "huancaina",
      "papa a la huancaina",
      "skordalia",
      "taramasalata",
      "tarama",
      "guacamole",
      "dip"
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
    "standfirst": "Every one of these is milk that has been made to quit, and nearly all of them are eaten within the week — feta, which spends months in brine, is the one walking off the fresh shelf while you watch. What separates them is what did the quitting — an acid, an enzyme, or heat applied to the whey another cheese threw away — and then four decisions about the curd: pressed or not, salted or not, stretched or not, and whether any of it will ever melt.",
    "root": "Milk — or the whey it left behind · brought to the point where it curdles · the curd lifted out",
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
            "holds its shape"
          ]
        },
        "note": "Acid dropped into milk at a boil does two things at once — denatures the whey protein and strips the calcium out of the curd. Nothing is left that could ever flow, which is why paneer browns in the pan, goes springy in a gravy, and is still cubes at the end of both."
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
            "holds its shape"
          ]
        },
        "note": "Paneer's twin stopped one step earlier. Nobody presses it and the milk never boils hard with the acid in it — so the curd stays soft enough to knead into a paste. The north gets cubes for gravy; Bengal poaches it in sugar syrup for rasgulla and cooks it down into a fudge for sandesh."
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
            "holds its shape"
          ]
        },
        "note": "Not made from milk at all. Ricotta means recooked: the albumin that rennet leaves behind in the whey comes back at around 85°C as a second cheese from the same pot. Under heat it grains rather than runs, and baked with egg it sets firm enough to slice."
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
            "barely any"
          ],
          "heat": [
            "holds its shape"
          ]
        },
        "note": "Ricotta's sibling rather than its variation — the same whey trick reached independently, with milk added back. Warmed, it stays in grains and browns at the edges rather than running. Left alone it is eaten within the week; salted hard and dried it becomes a grating cheese and leaves this family altogether, which is why the salt column here describes only the fresh one."
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
            "holds its shape"
          ]
        },
        "note": "The acid-set white round sold beside it is queso blanco. Set the same milk with rennet instead and you get a curd that takes salt right through and softens under heat rather than drying out — it never runs, and it crumbles over anything hot."
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
            "melts and pulls"
          ]
        },
        "note": "The published account is an accident rather than a transmission: a curd left too long at Reyes Etla in 1885, rescued with hot water, and found to stretch. Whether the stretching was learned from elsewhere or arrived at cold is not settled, and the finish is Oaxacan either way — one long ribbon wound into a ball, so the cheese strings when it is torn rather than sliced. It is what melts inside a quesadilla."
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
            "melts and pulls"
          ]
        },
        "note": "Mozzare means to cut off — the ball is torn from the hot rope by hand. It will only stretch inside a narrow window of acidity: a shade too sweet and it tears, a shade too sour and it dissolves into the water. On a pizza it weeps its own water and browns in blisters."
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
            "melts and pulls"
          ]
        },
        "note": "Genuinely mozzarella plus something, which is why it sits underneath: a mozzarella skin tied around the offcuts of the day's stretching, soaked in cream. Invented in Andria to use up scraps. The skin is the same stretched curd and melts like one, but burrata is meant cold — the filling runs the moment it is cut."
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
            "holds its shape"
          ]
        },
        "note": "Leaving out the starter keeps the curd sweet and full of calcium; cooking it in whey sets the protein hard. Two moves aimed at one thing — a cheese you can lay directly on a fire, where it grills to a brown crust and squeaks against the teeth."
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
            "holds its shape"
          ]
        },
        "note": "The one here that keeps going after it is made. Two months in brine is ripening rather than draining — feta walks off the fresh shelf while you watch it, and the salt is what carries it. Under a grill it softens and browns at the edges and never runs."
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
            "not cooked at all"
          ]
        },
        "note": "The gentlest coagulation on the table — bacteria walking milk down to pH 4.6 over eight hours instead of acid dropped in at a boil. What drains away is whey; what stays is yogurt with the water gone. It is eaten cold under olive oil and splits if you boil it."
      },
      {
        "name": "Cottage cheese",
        "facets": {
          "region": [
            "United States"
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
            "not cooked at all"
          ]
        },
        "note": "An English farmhouse cheese by descent, but the dressed-curd form and the name both settled in America, which is the country in the column. The wash is the whole character: rinsing the cooked curd takes the lactic acid off it and leaves grains that refuse to stick together — then cream is poured back in to hold them, and the salt goes into the cream rather than the curd. Eaten cold from the tub; it goes grainy if it is heated."
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
            "holds its shape"
          ]
        },
        "note": "Halloumi's problem solved again on another continent by people who had never met it: a rennet curd firm enough to face a fire on a skewer. Grilled on a stick over charcoal it browns without running. Sold off a bucket of coals on the beach."
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
            "holds its shape"
          ]
        },
        "note": "Bread cheese — pressed round like a loaf and stood by the fire until it scorches into leopard spots. The only one here that is browned before it ever reaches the table, it squeaks against the teeth and is dunked in coffee."
      },
      {
        "name": "Wara",
        "facets": {
          "region": [
            "West Africa",
            "Nigeria and Benin"
          ],
          "set": [
            "rennet",
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
            "holds its shape"
          ]
        },
        "note": "Calotropis procera sap carries proteases that cut casein in the same place rennet does — a rennet with no calf behind it, which is why it is filed under rennet here rather than off on its own. Deep-fried in slabs it crusts outside and stays soft within. Fulani women have made this on the move for centuries; it is wagashi in Benin and warankasi in Nigeria."
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
            "juice pressed from the nǎiténg vine",
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
            "holds its shape"
          ]
        },
        "note": "China's one dairy corner, made by Bai and Sani households. A climbing vine stands in for the lemon nobody had to import. Fried in slabs until gold, then dusted with salt and chilli at the table — the seasoning waits until the slab is out of the pan."
      }
    ],
    "notes": [
      {
        "title": "On the three ways to break milk",
        "body": "Acid does it by neutralising the charge that keeps casein micelles apart — they stop repelling each other and clump. Rennet does it by cutting one specific protein off the outside of the micelle, which has the same effect by a different route. Reheated whey is neither: the curd is already gone, and what sets is the whey protein left behind, which needs heat rather than a coagulant. The Sodom apple sap in wara is rennet by another name — a plant protease cutting casein at the same bond, so wara is filed under rennet rather than under its plant — and the nǎiténg vine in rubing is an acid nobody had to buy. Three routes, and every row here takes one of them."
      },
      {
        "title": "On melting",
        "body": "Melting is not about acid versus rennet — it is about how much calcium is left holding the protein together. Acid at a boil strips the calcium out completely, so paneer and rubing can never flow. Rennet with no starter leaves too much of it in, so halloumi and queijo coalho grill instead of running. Mozzarella lives in the gap: rennet first, then souring to about pH 5.2, which removes just enough calcium for the network to slide when it is hot and no more. That is the whole reason it is stretched at all. The heat column carries only that verdict — melts, holds, or never sees a pan — because what each cheese is then done to belongs in its note rather than in a column that has to fork."
      },
      {
        "title": "On pressing",
        "body": "Pressing is not about firmness so much as about what the cheese will be asked to do. Everything pressed under a weight is going to meet direct heat — a pan, a grill, a fire, a skewer. Everything left to drain under its own weight is going to be spread or crumbled or sweetened. Paneer and chhena are the same curd, and the press is the fork the diagram draws between them."
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
    "slug": "mole",
    "name": "Mole",
    "standfirst": "Mole is not one recipe and it is not chocolate sauce — mōlli is simply Nahuatl for sauce. What every one of these has in common is chillies ground with aromatics and given body by something that is not flour: bread, corn, a seed, a nut. Four decisions separate them — which chillies, what happens to those chillies before the grinder, what else goes in, and what carries the body — and the same four decisions, answered elsewhere in the world, produce romesco and muhammara and ají de gallina.",
    "root": "Chillies and aromatics ground to a paste, then let down into a sauce",
    "facets": [
      {
        "id": "chilli",
        "label": "Chilli"
      },
      {
        "id": "prep",
        "label": "First move"
      },
      {
        "id": "add",
        "label": "Added"
      },
      {
        "id": "body",
        "label": "Thickener"
      },
      {
        "id": "region",
        "label": "Region"
      }
    ],
    "nestings": [
      {
        "label": "By thickener",
        "by": [
          "body",
          "chilli",
          "add"
        ]
      },
      {
        "label": "By first move",
        "by": [
          "prep",
          "add",
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
        "name": "Mole poblano",
        "facets": {
          "chilli": [
            "dried chilli",
            "ancho",
            "mulato",
            "pasilla",
            "chipotle"
          ],
          "prep": [
            "chillies fried in fat",
            "in lard",
            "aromatics charred on the comal",
            "nuts and seeds fried separately"
          ],
          "add": [
            "nuts and seeds",
            "almond",
            "sesame seed",
            "raisin",
            "chocolate"
          ],
          "body": [
            "bread",
            "bolillo fried in lard",
            "toasted tortilla"
          ],
          "region": [
            "Mexico",
            "Puebla"
          ]
        },
        "note": "The one people mean when they say mole. Three chillies for depth and a fourth for smoke; every solid fried in lard on its own before it meets the grinder, which is why it takes a day rather than an afternoon."
      },
      {
        "name": "Mole negro",
        "facets": {
          "chilli": [
            "dried chilli",
            "chilhuacle negro",
            "mulato",
            "pasilla oaxaqueño",
            "guajillo"
          ],
          "prep": [
            "chillies fried in fat",
            "in lard",
            "aromatics charred on the comal",
            "chilli seeds burned to smoking"
          ],
          "add": [
            "nuts and seeds",
            "almond",
            "sesame seed",
            "plantain",
            "chocolate"
          ],
          "body": [
            "bread",
            "bolillo fried in lard",
            "burnt tortilla"
          ],
          "region": [
            "Mexico",
            "Oaxaca"
          ]
        },
        "note": "The black is not the chocolate. It is the reserved chilli seeds taken to the far side of toasted — burned until they smoke — plus a tortilla carried to charcoal, and the chilhuacle negro that Oaxaca grows and almost nowhere else does."
      },
      {
        "name": "Mole coloradito",
        "facets": {
          "chilli": [
            "dried chilli",
            "ancho",
            "guajillo",
            "chilhuacle rojo"
          ],
          "prep": [
            "chillies fried in fat",
            "in lard",
            "aromatics charred on the comal"
          ],
          "add": [
            "nuts and seeds",
            "almond",
            "plantain",
            "chocolate"
          ],
          "body": [
            "bread",
            "bolillo fried in lard"
          ],
          "region": [
            "Mexico",
            "Oaxaca"
          ]
        },
        "note": "Nothing is burned, so the red chillies stay red. The everyday Oaxacan mole and the one that turns into enchiladas on the second day."
      },
      {
        "name": "Mole amarillo",
        "facets": {
          "chilli": [
            "dried chilli",
            "chilcostle",
            "costeño amarillo",
            "guajillo"
          ],
          "prep": [
            "chillies toasted dry",
            "aromatics charred on the comal"
          ],
          "add": [
            "no nuts or seeds",
            "hoja santa",
            "miltomate"
          ],
          "body": [
            "masa",
            "slaked in cold water"
          ],
          "region": [
            "Mexico",
            "Oaxaca"
          ]
        },
        "note": "Thin enough to drink, because corn masa thickens without enriching. Hoja santa is obligatory in the valleys; the coast swaps in pitiona and the isthmus epazote, and it is still amarillo."
      },
      {
        "name": "Mole verde",
        "facets": {
          "chilli": [
            "fresh chilli",
            "jalapeño",
            "serrano"
          ],
          "prep": [
            "chillies go in raw",
            "tomatillos blended in raw",
            "nothing toasted at all",
            "herbs blended raw"
          ],
          "add": [
            "no nuts or seeds",
            "hoja santa",
            "epazote",
            "parsley"
          ],
          "body": [
            "masa",
            "slaked in cold water"
          ],
          "region": [
            "Mexico",
            "Oaxaca"
          ]
        },
        "note": "The only mole in Oaxaca where nothing meets a dry comal — heat is what kills the green. Made and eaten the same day for the same reason."
      },
      {
        "name": "Chichilo negro",
        "facets": {
          "chilli": [
            "dried chilli",
            "chilhuacle negro",
            "mulato",
            "pasilla oaxaqueño"
          ],
          "prep": [
            "chillies burned to black",
            "chilli seeds burned to smoking",
            "tomato charred on the comal"
          ],
          "add": [
            "no nuts or seeds",
            "avocado leaf",
            "no chocolate"
          ],
          "body": [
            "masa",
            "burnt tortilla"
          ],
          "region": [
            "Mexico",
            "Oaxaca"
          ]
        },
        "note": "The funeral mole, and the austere one: no nuts, no fruit, no chocolate, beef broth instead of turkey. Everything it has comes from ash and the anise of avocado leaf, and the bitterness is the point rather than an accident."
      },
      {
        "name": "Manchamanteles",
        "facets": {
          "chilli": [
            "dried chilli",
            "ancho",
            "guajillo"
          ],
          "prep": [
            "chillies fried in fat",
            "in lard",
            "aromatics charred on the comal",
            "fruit simmered in the sauce"
          ],
          "add": [
            "fruit",
            "pineapple",
            "plantain",
            "apple",
            "almond"
          ],
          "body": [
            "ground nuts",
            "almond",
            "the fruit itself"
          ],
          "region": [
            "Mexico",
            "Oaxaca"
          ]
        },
        "note": "Tablecloth-stainer. The fruit is not a garnish — it cooks down into the sauce and does half the thickening, with cider vinegar holding the sweetness in check."
      },
      {
        "name": "Pipián verde",
        "facets": {
          "chilli": [
            "fresh chilli",
            "serrano"
          ],
          "prep": [
            "chillies go in raw",
            "tomatillos blended in raw",
            "pumpkin seed toasted dry"
          ],
          "add": [
            "nuts and seeds",
            "pumpkin seed",
            "cilantro",
            "hoja santa"
          ],
          "body": [
            "ground seeds",
            "pumpkin seed"
          ],
          "region": [
            "Mexico",
            "Puebla"
          ]
        },
        "note": "The seed is not an enrichment here, it is the sauce. Ground pepitas thicken and then split if you let them boil, so it is held below a simmer from the moment it goes into the pan."
      },
      {
        "name": "Mole de olla",
        "facets": {
          "chilli": [
            "dried chilli",
            "guajillo",
            "pasilla",
            "chile de árbol"
          ],
          "prep": [
            "chillies toasted dry",
            "chillies soaked soft",
            "paste stirred straight into broth"
          ],
          "add": [
            "no nuts or seeds",
            "epazote",
            "summer vegetables",
            "beef shin"
          ],
          "body": [
            "no thickener",
            "left as broth"
          ],
          "region": [
            "Mexico",
            "Central Mexico"
          ]
        },
        "note": "A mole you eat with a spoon. It proves what the word means: the chilli paste is never fried and never thickened, just loosened into the pot, and it is still a mole."
      },
      {
        "name": "Adobo (Mexican)",
        "facets": {
          "chilli": [
            "dried chilli",
            "guajillo",
            "ancho"
          ],
          "prep": [
            "chillies toasted dry",
            "chillies soaked soft"
          ],
          "add": [
            "no nuts or seeds",
            "vinegar",
            "Mexican oregano",
            "cumin"
          ],
          "body": [
            "no thickener",
            "chilli pulp alone"
          ],
          "region": [
            "Mexico"
          ]
        },
        "note": "The floor of the family: chilli, garlic, spice, vinegar, nothing else. Thick enough to coat meat as a marinade and thin enough to serve as sauce — the body is the chilli pulp itself."
      },
      {
        "name": "Pepián",
        "facets": {
          "chilli": [
            "dried chilli",
            "chile guaque",
            "chile pasa",
            "chile cobán"
          ],
          "prep": [
            "chillies toasted dry",
            "seeds toasted dry",
            "tomato charred on the comal",
            "onion charred in its skin"
          ],
          "add": [
            "nuts and seeds",
            "pumpkin seed",
            "sesame seed",
            "cinnamon"
          ],
          "body": [
            "ground seeds",
            "pumpkin seed",
            "toasted tortilla"
          ],
          "region": [
            "Guatemala"
          ]
        },
        "note": "Guatemala's national dish and pipián's sibling rather than its child — same answer to the thickener question, reached with different chillies and a comal that chars everything including the onion skin."
      },
      {
        "name": "Romesco",
        "facets": {
          "chilli": [
            "dried chilli",
            "ñora",
            "choricero"
          ],
          "prep": [
            "chillies soaked without toasting",
            "tomato and garlic roasted whole",
            "bread fried in olive oil",
            "nuts toasted dry"
          ],
          "add": [
            "nuts and seeds",
            "almond",
            "hazelnut",
            "sherry vinegar"
          ],
          "body": [
            "bread",
            "fried bread",
            "ground almond"
          ],
          "region": [
            "Spain",
            "Catalonia"
          ]
        },
        "note": "The same bread-and-ground-almond logic mole poblano's Spanish half was built on: dried mild chilli rehydrated, aromatics roasted, fried bread and ground nuts for body. Not poblano's ancestor — ñora is a New World pepper too, and romesco in this form is no older than the exchange — but both stand on the same medieval Iberian sauce. What it leaves out is the spice cabinet."
      },
      {
        "name": "Muhammara",
        "facets": {
          "chilli": [
            "dried chilli",
            "Aleppo pepper",
            "roasted red pepper"
          ],
          "prep": [
            "peppers roasted whole",
            "walnuts toasted dry",
            "nothing cooked after"
          ],
          "add": [
            "fruit",
            "pomegranate molasses",
            "walnut",
            "cumin"
          ],
          "body": [
            "bread",
            "breadcrumb",
            "ground walnut"
          ],
          "region": [
            "Syria",
            "Aleppo"
          ]
        },
        "note": "The uncooked one. Bread and nut for body like romesco; fruit for sweet-sourness like manchamanteles — but the grinding is where it ends, so nothing ever meets a pan of fat."
      },
      {
        "name": "Ají de gallina",
        "facets": {
          "chilli": [
            "fresh chilli",
            "ají amarillo paste"
          ],
          "prep": [
            "chillies fried in fat",
            "in oil",
            "onion and garlic fried first",
            "bread soaked in milk"
          ],
          "add": [
            "nuts and seeds",
            "walnut",
            "pecan",
            "parmesan"
          ],
          "body": [
            "bread",
            "white bread soaked in milk",
            "ground walnut"
          ],
          "region": [
            "Peru"
          ]
        },
        "note": "Peru's version of the same trick, by way of a Spanish bread-and-almond sauce: ají amarillo fried into an onion base, bread soaked soft in milk, walnuts ground in for weight."
      },
      {
        "name": "Mafé",
        "facets": {
          "chilli": [
            "fresh chilli",
            "scotch bonnet"
          ],
          "prep": [
            "chillies go in raw",
            "onion fried in oil",
            "peanuts roasted before grinding"
          ],
          "add": [
            "nuts and seeds",
            "peanut",
            "tomato paste"
          ],
          "body": [
            "ground nuts",
            "peanut paste"
          ],
          "region": [
            "Senegal"
          ]
        },
        "note": "Mandinka in origin and eaten across West Africa. Like pipián it hands the whole job to one ground seed — here the peanut, which thickens, enriches and carries the chilli at once."
      },
      {
        "name": "Korma",
        "facets": {
          "chilli": [
            "dried chilli",
            "Kashmiri chilli"
          ],
          "prep": [
            "chillies fried in fat",
            "in ghee",
            "onion fried to gold",
            "nuts soaked soft"
          ],
          "add": [
            "nuts and seeds",
            "almond",
            "cashew",
            "yoghurt"
          ],
          "body": [
            "ground nuts",
            "cashew paste",
            "yoghurt"
          ],
          "region": [
            "India",
            "North India"
          ]
        },
        "note": "Mughlai, and the proof that the nut-bodied sauce does not need heat to be interesting: Kashmiri chilli is chosen for colour rather than burn, and the almond and cashew do everything the chilli does not."
      }
    ],
    "notes": [
      {
        "title": "On the word",
        "body": "Mōlli is Nahuatl for sauce, full stop. It carries no promise of chocolate, of chillies in the dozens, or of a day at the stove — mole de olla is a soup and is not a lesser mole for it. The elaborate ones are elaborate because a feast asked them to be, not because the word demands it."
      },
      {
        "title": "On chocolate",
        "body": "Three of the sixteen here take it, in quantities that would ruin a dessert — an ounce or two of bitter chocolate in several litres of sauce, working as a dark background note the way a bay leaf does. Amarillo, verde and chichilo have none, and chichilo gets its black from char alone."
      },
      {
        "title": "On burning",
        "body": "Oaxaca is the only tradition here that takes an ingredient deliberately past toasted. In mole negro the reserved chilli seeds are held on the comal until they smoke; in chichilo the chillies themselves go to charcoal, and a tortilla with them. The bitterness that arrives is the flavour being sought, which is why the line between negro and a ruined pan is drawn by smell and about ninety seconds."
      },
      {
        "title": "On the thickener",
        "body": "This is where the family stops being Mexican. Bread, corn masa, a ground seed or a ground nut — four answers to how a chilli sauce gets body without flour, and the four recur in Catalonia, Aleppo, Lima and Dakar. Some of that agreement is genuine convergence: nobody carried the pipián to Senegal, and mafé hands the whole job to a ground seed on its own. Romesco and mole poblano are the other case, and contact is the honest half of it — the bread-and-ground-almond sauce is medieval Iberian and sailed west with the Spanish, which is where poblano's almonds, sesame, cinnamon, raisins, fried bolillo and lard come from, and ají de gallina inherits the same sauce more plainly still. What did not sail was the rest of it: the chillies, the comal, the word."
      },
      {
        "title": "On depth",
        "body": "Nothing here is given a parent. The seven moles of Oaxaca are made by the same cooks in the same kitchens and are still siblings, not a descent line — negro is not coloradito plus burnt seeds, and poblano is not adobo plus everything. Drawing those arrows would make a tidier picture and a false one."
      }
    ],
    "sources": [
      {
        "label": "Mole (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Mole_(sauce)"
      },
      {
        "label": "Moles oaxaqueños",
        "url": "https://es.wikipedia.org/wiki/Moles_oaxaque%C3%B1os"
      },
      {
        "label": "Chilhuacle",
        "url": "https://en.wikipedia.org/wiki/Chilhuacle"
      },
      {
        "label": "Mole amarillo (Larousse Cocina)",
        "url": "https://laroussecocina.mx/palabra/mole-amarillo-amarillo-o-amarillito/"
      },
      {
        "label": "Pipián",
        "url": "https://es.wikipedia.org/wiki/Pipi%C3%A1n"
      },
      {
        "label": "Mole de olla",
        "url": "https://es.wikipedia.org/wiki/Mole_de_olla"
      },
      {
        "label": "Pepián",
        "url": "https://en.wikipedia.org/wiki/Pepi%C3%A1n"
      },
      {
        "label": "Romesco",
        "url": "https://en.wikipedia.org/wiki/Romesco"
      },
      {
        "label": "Muhammara",
        "url": "https://en.wikipedia.org/wiki/Muhammara"
      },
      {
        "label": "Ají de gallina",
        "url": "https://en.wikipedia.org/wiki/Aj%C3%AD_de_gallina"
      },
      {
        "label": "Maafe (peanut stew)",
        "url": "https://en.wikipedia.org/wiki/Peanut_stew"
      },
      {
        "label": "Korma",
        "url": "https://en.wikipedia.org/wiki/Korma"
      }
    ],
    "yours": [
      "mole",
      "mole poblano",
      "mole negro",
      "mole verde",
      "mole amarillo",
      "coloradito",
      "chichilo",
      "manchamanteles",
      "pipián",
      "pipian",
      "mole de olla",
      "adobo",
      "pepián",
      "romesco",
      "muhammara",
      "ají de gallina",
      "mafé",
      "peanut stew",
      "groundnut stew",
      "korma",
      "mole rojo",
      "enmoladas"
    ]
  },
  {
    "slug": "mother-sauce",
    "name": "Mother sauces",
    "standfirst": "Five sauces that one French kitchen had settled on by 1907, and four sauces from elsewhere that answer the same question without it. All of them are a liquid plus something that will not let it stay a liquid — flour cooked in fat, an egg yolk, a starch, a ground seed. The mothers are the base. The derivatives are the base plus one thing, which is why they are drawn underneath.",
    "root": "A liquid · something worked into it that will hold it · cooked until it coats the back of a spoon",
    "facets": [
      {
        "id": "thicken",
        "label": "Thickened with"
      },
      {
        "id": "liquid",
        "label": "The liquid"
      },
      {
        "id": "add",
        "label": "Added"
      },
      {
        "id": "break",
        "label": "How it breaks"
      },
      {
        "id": "region",
        "label": "Region"
      }
    ],
    "nestings": [
      {
        "label": "By thickener",
        "by": [
          "thicken",
          "liquid",
          "add"
        ]
      },
      {
        "label": "By what can go wrong",
        "by": [
          "break",
          "thicken",
          "add"
        ]
      },
      {
        "label": "By region",
        "by": [
          "region",
          "thicken"
        ]
      }
    ],
    "dishes": [
      {
        "name": "Béchamel",
        "facets": {
          "thicken": [
            "a roux",
            "cooked white",
            "equal weights of butter and flour"
          ],
          "liquid": [
            "milk",
            "warmed before it goes in",
            "infused with an onion stuck with cloves and bay"
          ],
          "add": [
            "nothing but seasoning",
            "nutmeg",
            "white pepper"
          ],
          "break": [
            "safe at a simmer",
            "skins over the moment you stop stirring",
            "turns gluey if it boils hard"
          ],
          "region": [
            "France"
          ]
        },
        "note": "The plainest statement of the whole family: flour cooked in butter only until it stops smelling raw, then milk. Everything on the roux side of this page is these same two ingredients left in the pan for longer. Italy claims it as well, as salsa colla carried north by Catherine de' Medici's cooks — but the archives are against that story: no Italian cook has been found among her servants between her arrival in France and her death."
      },
      {
        "name": "Mornay",
        "parent": "Béchamel",
        "facets": {
          "thicken": [
            "a roux",
            "cooked white",
            "equal weights of butter and flour"
          ],
          "liquid": [
            "milk",
            "warmed before it goes in",
            "infused with an onion stuck with cloves and bay"
          ],
          "add": [
            "cheese",
            "gruyère and parmesan grated in off the heat",
            "an egg yolk in the older versions"
          ],
          "break": [
            "safe at a simmer",
            "the cheese goes stringy and weeps fat if it boils",
            "which is why it goes in off the heat"
          ],
          "region": [
            "France"
          ]
        },
        "note": "Béchamel plus cheese and nothing else — it genuinely is the parent with one addition. The only rule is that the pan comes off first: held at a boil, melted cheese protein tightens and squeezes its own fat out."
      },
      {
        "name": "Soubise",
        "parent": "Béchamel",
        "facets": {
          "thicken": [
            "a roux",
            "cooked white",
            "onion purée doing half the work"
          ],
          "liquid": [
            "milk",
            "warmed before it goes in",
            "the onions give up their own water into it"
          ],
          "add": [
            "onion",
            "sweated pale in butter until it collapses",
            "puréed and folded back through"
          ],
          "break": [
            "safe at a simmer",
            "ruined the moment the onions take colour",
            "the whole point is that it stays white"
          ],
          "region": [
            "France"
          ]
        },
        "note": "Béchamel plus onions cooked without a hint of browning. Escoffier's version thickens with rice simmered in the onions instead of a roux — same sauce; the starch just arrives by another route."
      },
      {
        "name": "Velouté",
        "facets": {
          "thicken": [
            "a roux",
            "cooked blond",
            "taken to the colour of straw"
          ],
          "liquid": [
            "a white stock",
            "veal or chicken or fish",
            "bones that were never roasted"
          ],
          "add": [
            "nothing but seasoning",
            "white pepper",
            "a squeeze of lemon"
          ],
          "break": [
            "safe at a simmer",
            "skins over if left still",
            "clouds if the stock was not skimmed"
          ],
          "region": [
            "France"
          ]
        },
        "note": "Béchamel's fork: the same roux one shade darker and stock where the milk was. The stock brings gelatine, so a velouté sets when it cools and a béchamel does not."
      },
      {
        "name": "Suprême",
        "parent": "Velouté",
        "facets": {
          "thicken": [
            "a roux",
            "cooked blond",
            "cream reduced in until it coats"
          ],
          "liquid": [
            "a white stock",
            "chicken",
            "mushroom trimmings simmered in it"
          ],
          "add": [
            "cream",
            "boiled in rather than stirred in",
            "cold butter whisked through at the end"
          ],
          "break": [
            "safe at a simmer",
            "the butter finish splits on reheating",
            "so it is made to be served"
          ],
          "region": [
            "France"
          ]
        },
        "note": "Chicken velouté enriched twice — cream reduced into it and then butter beaten in off the heat. The second enrichment is an emulsion sitting on top of a starch sauce; that is what will not survive a second heating."
      },
      {
        "name": "Allemande",
        "parent": "Velouté",
        "facets": {
          "thicken": [
            "a roux",
            "cooked blond",
            "then a liaison of egg yolk and cream"
          ],
          "liquid": [
            "a white stock",
            "veal",
            "reduced hard before the liaison goes in"
          ],
          "add": [
            "egg yolk",
            "beaten with cream",
            "lemon juice at the end"
          ],
          "break": [
            "curdles if it boils after the yolks",
            "the yolks must be tempered with hot sauce first",
            "no way back once it scrambles"
          ],
          "region": [
            "France"
          ]
        },
        "note": "Carême counted this one of his four mothers. Escoffier moved it down here, on the grounds that a sauce built on velouté cannot also be its parent — and put tomate in its place at the top, with hollandaise making a fifth. It is the one sauce on this page thickened twice over, by flour and then by yolk, which is why it takes more heat than avgolemono does."
      },
      {
        "name": "Espagnole",
        "facets": {
          "thicken": [
            "a roux",
            "cooked brown",
            "taken to the colour of a hazelnut shell"
          ],
          "liquid": [
            "a brown stock",
            "veal bones roasted first",
            "mirepoix and tomato purée underneath"
          ],
          "add": [
            "nothing but seasoning",
            "the mirepoix strained out at the end"
          ],
          "break": [
            "safe at a hard boil",
            "bitter for good if the roux catches",
            "greasy unless it is skimmed as it simmers"
          ],
          "region": [
            "France"
          ]
        },
        "note": "The same roux left in the pan until the flour browns. Browning breaks the starch chains, so a brown roux has perhaps a third of the thickening power of a white one — you are buying flavour and paying for it in body. The two things that ruin it are both patience: a roux taken one shade too far is bitter and stays bitter, and fat left unskimmed never comes back out."
      },
      {
        "name": "Demi-glace",
        "parent": "Espagnole",
        "facets": {
          "thicken": [
            "a roux",
            "cooked brown",
            "then boiled down by half"
          ],
          "liquid": [
            "a brown stock",
            "veal bones roasted first",
            "a second equal measure poured into the finished espagnole"
          ],
          "add": [
            "nothing but seasoning",
            "skimmed for hours",
            "a splash of Madeira in some houses"
          ],
          "break": [
            "safe at a hard boil",
            "goes bitter and cloudy if the skimming is skipped",
            "sets to a jelly when cold"
          ],
          "region": [
            "France"
          ]
        },
        "note": "The only dish here whose addition is not an ingredient. Espagnole plus more of the same stock and several hours — the flour is skimmed away as scum and gelatine takes over the body it used to provide."
      },
      {
        "name": "Bordelaise",
        "parent": "Demi-glace",
        "facets": {
          "thicken": [
            "a roux",
            "cooked brown",
            "then boiled down by half"
          ],
          "liquid": [
            "a brown stock",
            "veal bones roasted first",
            "red wine reduced almost dry first"
          ],
          "add": [
            "red wine",
            "shallots boiled down in it with thyme and bay",
            "poached marrow spooned in at the end"
          ],
          "break": [
            "safe at a hard boil",
            "the marrow melts to plain fat if it is boiled",
            "so it goes in off the heat"
          ],
          "region": [
            "France"
          ]
        },
        "note": "Two levels down and honestly so: it is demi-glace, which is espagnole, plus a wine reduction and marrow. The name is the wine, a red from Bordeaux, and nobody makes bordelaise from scratch in an afternoon — the depth of the tree is the depth of the work."
      },
      {
        "name": "Hollandaise",
        "facets": {
          "thicken": [
            "an emulsion",
            "egg yolk holding warm butter in suspension",
            "no flour anywhere"
          ],
          "liquid": [
            "clarified butter",
            "warm and poured in a thread",
            "a spoonful of water to start the yolks"
          ],
          "add": [
            "nothing but seasoning",
            "lemon juice",
            "cayenne"
          ],
          "break": [
            "splits above about 70°C",
            "splits if the butter arrives faster than the yolk can take it",
            "comes back if whisked into a spoonful of cold water"
          ],
          "region": [
            "France"
          ]
        },
        "note": "The other half of the family. Nothing is cooked and nothing is thickened — the yolk's lecithin coats millions of butter droplets and keeps them from finding each other. Body here is crowding; thin the crowd and the sauce is butter again."
      },
      {
        "name": "Béarnaise",
        "parent": "Hollandaise",
        "facets": {
          "thicken": [
            "an emulsion",
            "egg yolk holding warm butter in suspension",
            "no flour anywhere"
          ],
          "liquid": [
            "clarified butter",
            "warm and poured in a thread",
            "the reduction standing in for the water"
          ],
          "add": [
            "a reduction",
            "tarragon and shallot boiled down in vinegar",
            "chopped tarragon and chervil stirred through at the end"
          ],
          "break": [
            "splits above about 70°C",
            "the same ceiling as hollandaise",
            "comes back if whisked into a spoonful of cold water"
          ],
          "region": [
            "France"
          ]
        },
        "note": "Hollandaise with a vinegar reduction in place of the water and tarragon through it. The reduction replaces the water, not the limit: this splits at the same temperature its parent does. Named not for its cooking but for Henry IV le Béarnais, whose old residence housed the restaurant where it was made — twenty kilometres from Paris and seven hundred from Béarn."
      },
      {
        "name": "Sauce tomate",
        "facets": {
          "thicken": [
            "a roux",
            "cooked blond",
            "in salt pork fat rather than butter"
          ],
          "liquid": [
            "tomato",
            "let down with a white stock",
            "salt pork and mirepoix underneath"
          ],
          "add": [
            "nothing but seasoning",
            "a pinch of sugar against the acid"
          ],
          "break": [
            "safe at a hard boil",
            "catches on the base of the pan if it is left alone",
            "weeps water back out if it is under-reduced"
          ],
          "region": [
            "France"
          ]
        },
        "note": "The odd mother: the only one that would still be a sauce with the roux left out, because reduced tomato thickens itself. Escoffier kept the roux anyway, and cooked it in salt pork fat rather than butter. The Italian line of descent — amatriciana, puttanesca, vodka — has its own family in this canon."
      },
      {
        "name": "Gumbo roux",
        "facets": {
          "thicken": [
            "a roux",
            "cooked past brown to the colour of chocolate",
            "oil or lard rather than butter"
          ],
          "liquid": [
            "a stock",
            "shellfish or chicken or plain water",
            "poured on hot once the roux is stopped"
          ],
          "add": [
            "the trinity",
            "onion and bell pepper and celery tipped in to arrest the roux",
            "filé or okra later if more body is wanted"
          ],
          "break": [
            "safe at a hard boil",
            "scorches in seconds at the colour it wants",
            "burnt flecks cannot be strained back out"
          ],
          "region": [
            "United States",
            "Louisiana",
            "Cajun",
            "Creole"
          ]
        },
        "note": "The far end of the same dial as espagnole, forty minutes further along. At this colour the flour has almost stopped thickening and is there for flavour, which is why a gumbo needs a cupful where a béchamel needs a spoon. Butter would burn long before; oil is not a shortcut but the condition of getting there."
      },
      {
        "name": "Avgolemono",
        "facets": {
          "thicken": [
            "a liaison",
            "egg yolk beaten with lemon juice",
            "no flour anywhere"
          ],
          "liquid": [
            "a broth",
            "whatever the meat or the dolmades cooked in",
            "ladled hot into the eggs before the eggs go back"
          ],
          "add": [
            "lemon",
            "beaten into the yolks from the start",
            "dill or nothing"
          ],
          "break": [
            "curdles if it boils after the yolks",
            "no starch between the yolks",
            "so it curdles at a lower heat than allemande"
          ],
          "region": [
            "Eastern Mediterranean",
            "Greece",
            "Turkey",
            "the Sephardi kitchen"
          ]
        },
        "note": "The same move as allemande with the roux deleted — egg yolk alone carrying a broth, and no fat in it but the yolk's own — and older than the French sauce by centuries. Deleting the roux is what costs it heat: swollen starch granules get between the yolk proteins and slow them finding each other, so allemande will take a temperature this will not. Turkish calls it terbiye and the Sephardi kitchen agristada; before lemons reached the Mediterranean the sourness came from verjuice or bitter orange."
      },
      {
        "name": "Ankake",
        "facets": {
          "thicken": [
            "a starch slurry",
            "potato starch or kudzu slaked in cold water",
            "brought back to a boil to turn it clear"
          ],
          "liquid": [
            "dashi",
            "kombu and katsuobushi",
            "no fat in it anywhere"
          ],
          "add": [
            "soy sauce",
            "mirin for the sweetness",
            "ginger grated in at the end"
          ],
          "break": [
            "safe through one boil",
            "slackens again if it is held hot",
            "potato starch loses its gloss as it cools"
          ],
          "region": [
            "Japan"
          ]
        },
        "note": "Starch with no fat to carry it. A roux uses butter to keep the flour grains apart so they swell one at a time instead of lumping; cold water does the same job for nothing. What you lose is the flavour of cooked flour — which is exactly what this sauce is trying not to have. The two starches part company as the sauce cools: potato starch dulls and slumps, while kudzu sets, which is why the same powder makes kuzumochi and goma-dofu."
      },
      {
        "name": "Pipián verde",
        "facets": {
          "thicken": [
            "a paste of ground seeds",
            "pumpkin seeds toasted then milled",
            "let down with broth"
          ],
          "liquid": [
            "a broth",
            "chicken or pork",
            "tomatillos blended in raw"
          ],
          "add": [
            "tomatillo",
            "serrano and coriander",
            "a leaf of hoja santa"
          ],
          "break": [
            "separates as the seed oil rises",
            "stirred back together over a low flame",
            "grainy for good if the seeds were milled too coarse"
          ],
          "region": [
            "Mexico",
            "Puebla",
            "Oaxaca"
          ]
        },
        "note": "Thickened by the fat and protein of the seed itself rather than by starch or egg, and on the table long before anyone in France cooked flour in butter. The word comes from Nahuatl. Its sibling with chillies and chocolate is a mole; the thickening decision is the same one."
      }
    ],
    "notes": [
      {
        "title": "On the count of five",
        "body": "Carême named four in 1833: béchamel, velouté, espagnole and allemande. Escoffier kept the first three, demoted allemande to a velouté derivative because it is one, promoted tomate, and added hollandaise — four became five, and the fifth slot is one he made. Le Guide Culinaire did the demoting in 1903; hollandaise takes its place among the basic sauces in the English edition of 1907, which is where the modern five come from. So the number is an editorial decision about a French kitchen at a particular date, not a fact about sauces — which is why avgolemono and pipián sit at the top of this page rather than under anything."
      },
      {
        "title": "On how far you cook the flour",
        "body": "White for béchamel; blond for velouté and tomate; brown for espagnole; past brown to chocolate in Louisiana. It is one dial with four stops. Heat browns the flour by breaking the starch chains into shorter pieces, and short pieces cannot hold water — so thickening power falls away exactly as flavour arrives. A dark roux may thicken a third as well as a pale one of the same weight. That single trade explains why béchamel is stiff and espagnole is not; and why a gumbo needs a cup of roux where a béchamel needs a spoon."
      },
      {
        "title": "On the two ways to hold a liquid",
        "body": "Starch swells and gets in the way — grains absorb water and crowd the space, and once they have done it they are stable to a boil. Protein does it by surrounding: egg yolk either coats droplets of fat so they cannot coalesce (hollandaise) or sets loosely into a mesh (avgolemono). Protein gives a finer sauce and takes it away above about 70°C. Allemande has both, and the starch is the reason it takes more heat than avgolemono: swollen granules sit between the yolk proteins and slow them finding each other. Read the 'how it breaks' column and the whole family sorts itself into things you can boil and things you cannot."
      },
      {
        "title": "On sauces named for the wrong place",
        "body": "Four of the French names point abroad and none of them means it. Allemande is the pale one, and the same sauce answers to parisienne. Espagnole carries a legend about Spanish cooks at Louis XIII's wedding that nobody has managed to source. Hollandaise was renamed Isigny for a while, after the Normandy butter that is actually in it. Béarnaise honours a king who came from Béarn, not a kitchen that did. The region column says France for all four, because France is where they were made — the stories live in the notes, where their standing can be stated."
      },
      {
        "title": "On depth",
        "body": "This family really is additive, so the tree is deep where the cooking is. Mornay is béchamel plus cheese; bordelaise is demi-glace which is espagnole plus stock and time. But the four non-French sauces sit at the top level with the mothers, not underneath them. Avgolemono is not a French liaison with a Greek accent and ankake is not a fat-free velouté — they are separate answers to the question of how to make a broth cling, and hanging them under Paris would make the picture tidier and the claim false."
      },
      {
        "title": "On what is one move further out",
        "body": "Every mother carries a dozen more children than fit here. Béchamel also gives crème, mustard and Nantua (crayfish butter). Velouté gives Bercy and normande. Espagnole gives chasseur, Robert and Périgueux. Hollandaise gives maltaise (blood orange juice and zest), mousseline (whipped cream folded through) and Choron (béarnaise with tomato, which is two levels down like bordelaise). None of them changes the shape of the tree — they are all the same operation, base plus one thing, applied once more."
      }
    ],
    "sources": [
      {
        "label": "Mother sauce (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Mother_sauce"
      },
      {
        "label": "Roux",
        "url": "https://en.wikipedia.org/wiki/Roux"
      },
      {
        "label": "Béchamel sauce",
        "url": "https://en.wikipedia.org/wiki/B%C3%A9chamel_sauce"
      },
      {
        "label": "Velouté sauce",
        "url": "https://en.wikipedia.org/wiki/Velout%C3%A9_sauce"
      },
      {
        "label": "Espagnole sauce",
        "url": "https://en.wikipedia.org/wiki/Espagnole_sauce"
      },
      {
        "label": "Demi-glace",
        "url": "https://en.wikipedia.org/wiki/Demi-glace"
      },
      {
        "label": "Hollandaise sauce",
        "url": "https://en.wikipedia.org/wiki/Hollandaise_sauce"
      },
      {
        "label": "Béarnaise sauce",
        "url": "https://en.wikipedia.org/wiki/B%C3%A9arnaise_sauce"
      },
      {
        "label": "Avgolemono",
        "url": "https://en.wikipedia.org/wiki/Avgolemono"
      },
      {
        "label": "Agristada (Sephardic egg-lemon sauce)",
        "url": "https://reformjudaism.org/reform-jewish-life/food-recipes/agristada-sephardic-egg-lemon-sauce"
      },
      {
        "label": "Gumbo",
        "url": "https://en.wikipedia.org/wiki/Gumbo"
      },
      {
        "label": "Pipián",
        "url": "https://en.wikipedia.org/wiki/Pipi%C3%A1n"
      },
      {
        "label": "Le Guide Culinaire (Escoffier)",
        "url": "https://en.wikipedia.org/wiki/Le_Guide_Culinaire"
      },
      {
        "label": "Kudzu (kuzu starch)",
        "url": "https://en.wikipedia.org/wiki/Kudzu"
      }
    ],
    "yours": [
      "mother sauce",
      "bechamel",
      "béchamel",
      "white sauce",
      "cheese sauce",
      "mornay",
      "soubise",
      "veloute",
      "velouté",
      "suprême",
      "allemande",
      "espagnole",
      "demi-glace",
      "bordelaise",
      "hollandaise",
      "bearnaise",
      "béarnaise",
      "roux",
      "sauce tomate",
      "avgolemono",
      "terbiye",
      "agristada",
      "ankake",
      "gumbo",
      "pipián"
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
    "standfirst": "Ground meat and salt, and then one decision: sell it raw and let whoever buys it do the cooking, hang it in cold air until it keeps for a year, or cook it in the making — by smoke, scald, steam or poach — so it reaches the counter already food. Everything after that — the fennel, the harissa, the pimentón, the coriander and clove — is a region answering the same question about what to put in. Fresh chorizo and dry chorizo are not one sausage at two ages. They sit in different branches and share a name.",
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
            "through a plate"
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
            "hand-chopped"
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
        "note": "Pepper-led rather than herb-led, which is unusual in England — Lincolnshire answers the same brief with sage. The meat is chopped by hand rather than put through a mincer, so a slice reads as pieces. Traditional Cumberland holds a PGI, and part of what is protected is the shape: it is never twisted into links."
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
            "hand-chopped"
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
        "name": "Chorizo mexicano",
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
            "guajillo",
            "vinegar",
            "Mexican oregano"
          ],
          "region": [
            "Mexico"
          ]
        },
        "note": "Not young Spanish chorizo. The pimentón was traded for guajillo and ancho, the vinegar was pushed up, and the drying step was dropped entirely — so it stays raw, and it is usually squeezed out of the casing into the pan, where it crumbles instead of holding together."
      },
      {
        "name": "Longganisa de recado",
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
            "through a plate"
          ],
          "spice": [
            "garlic",
            "cane vinegar",
            "black pepper"
          ],
          "region": [
            "Philippines"
          ]
        },
        "note": "Named from Spanish longaniza and then rebuilt around garlic: Ilocos pounds in enough of it to perfume the room it is fried in, and Vigan is the reference. The short links are hung a day or two before they are sold, which is a brief ferment — the only fresh sausage here that sours on purpose."
      },
      {
        "name": "Longganisa hamonado",
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
            "through a plate"
          ],
          "spice": [
            "sugar",
            "garlic",
            "soy sauce"
          ],
          "region": [
            "Philippines"
          ]
        },
        "note": "The sweet half of the same name, and not an older or younger version of the sour one: sugar stands where the souring would have been, so nothing is hung and nothing ferments. Pampanga is the usual reference. The sugar catches long before the meat is done, which is why these links are started in a little water and finished in the fat they render."
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
            "through a plate"
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
            "through a narrow plate"
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
        "note": "Beef, ten days to a fortnight of ferment, and then air. The fine paste is kneaded until it turns sticky before it is stuffed, which is the whole of the bind. Dry-cured like chorizo but not eaten like it: sucuk goes in a cold pan and renders its own fat, so the drying is there to concentrate it rather than to make it ready."
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
            "hand-chopped"
          ],
          "spice": [
            "sugar",
            "light soy",
            "mei kwei lu"
          ],
          "region": [
            "China",
            "Guangdong"
          ]
        },
        "note": "The one dried sausage here that does not ferment. Sugar and salt take the water out on their own, so nothing sours, and the result stays hard and sweet and has to be steamed over rice before it is food. Lean and fat are cut separately by hand, which is why the fat reads as translucent beads rather than a smear. Rose-scented mei kwei lu is the perfume that makes it recognisable across a room."
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
            "ground twice"
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
            "hand-chopped"
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
        "note": "The only sausage here cooked by smoke alone — no water bath, no oven, just hours over pecan and sometimes sugarcane until it is done through and nearly dry at the edge. The meat is cut in chunks by hand rather than ground, so it holds its shape in a gumbo. It shares a name with French andouille and almost nothing else, since the French one is made of tripe."
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
            "through a plate"
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
        "note": "Frankfurt made it from pork in a sheep casing; a Frankfurt butcher working in Vienna put beef in the mix and still called it a Frankfurter, which is what Vienna calls it to this day — while Germany calls that beef-and-pork version a Wiener. Each city ended up naming the sausage after the other. The seasoning is deliberately quiet because there is no texture to compete with — an emulsion is uniform all the way through."
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
            "cubes of throat fat folded back in"
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
        "note": "The same emulsion as a frankfurter, with the fat put back by hand: cubes of throat fat folded into the paste so they stay whole and read as white polka dots. The Mortadella Bologna PGI names that fat and no other. A large one steams in dry air for the better part of a day, and the name may come from myrtle, which is still in the better recipes."
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
        "body": "Salt here is structure, not seasoning. Above roughly two per cent it dissolves myosin out of the muscle fibres, and that dissolved protein is the glue holding one grain of meat to the next; without it a sausage is mince in a bag that falls apart in the pan. This is why every recipe in the family says work it cold and stop when it turns tacky. Let the fat climb past about fifteen degrees and it smears instead of staying in pieces, the bind breaks, and the sausage cooks out grey with a puddle of grease beside it. One rule, seventeen dishes."
      },
      {
        "title": "On the emulsion",
        "body": "Mortadella and the frankfurter are not fresh sausages ground finer. They are a different physical object: fat cut so small it is suspended in a gel of protein and water, chopped with ice so the bowl never warms, and the gel only sets when heat runs through it. That is the reason they cannot be sold raw — the sausage does not exist until it has been cooked. A fresh sausage is meat held together. An emulsion is meat taken apart and rebuilt, and the row of white cubes in a slice of mortadella is throat fat deliberately put back in afterwards, because otherwise there would be nothing to see."
      },
      {
        "title": "On the casing",
        "body": "The casing is the column that is not in the table, and it decides more than it looks. Merguez goes into a narrow lamb runner so it chars before the middle can dry. Cumberland is never linked at all — it reaches the pan as one coil pinned with a skewer, and the PGI protects that shape. Mortadella needs a casing as wide as a bladder because it has to steam for most of a day. And two dishes here prove the casing can be a mould rather than part of the dish: 'nduja is spread on bread and Mexican chorizo is squeezed into a hot pan, and neither is ever eaten in its skin."
      },
      {
        "title": "On two chorizos with one name",
        "body": "Spanish chorizo is fermented, hung for weeks and sliced cold. Mexican chorizo is raw, sharp with vinegar, and disintegrates in the pan on purpose. The second is not a younger version of the first: when the sausage crossed the Atlantic the pimentón was replaced by guajillo and ancho, the drying was abandoned, and only the name survived the trip. Calling the Mexican one chorizo fresco would put the trap back, because in Spain that name belongs to the fresh pimentón sausage. The table is full of the same problem. Longganisa took its name from Spanish longaniza and its garlic and cane vinegar from Ilocos, then split again on its own into a sour camp and a sweet one, which is why it holds two rows here. Cajun andouille shares a word with French andouille, which is made of tripe. And 'nduja, andouille and andouillette all descend from the same Latin inductilia — the word travelled much further than the recipe did."
      },
      {
        "title": "On blood",
        "body": "Blood is a whole branch sitting in one seat. Boudin noir stands here for morcilla de Burgos, which is bulked with rice; for Korean sundae, bulked with glass noodles; for black pudding with its oatmeal, for Polish kaszanka with its buckwheat, for German Blutwurst with neither. What separates them is not the blood, which behaves the same everywhere — it is the starch each region had to hand. They are siblings, and none of them is a version of any of the others."
      },
      {
        "title": "On depth",
        "body": "Nothing in this table is nested under anything else, and that is a claim rather than laziness. Real lineage exists in sausage, but it mostly runs out of the table: droëwors is boerewors hung until dry, Mexican chorizo is a fork from Spanish chorizo rather than a stage of it, the Wiener and the Frankfurter are two cities arguing over one object. The two longganisa are the same argument in miniature — hamonado is not de recado plus sugar, it is de recado with the souring taken out and the sugar put where it was, so neither can be hung under the other. Seventeen traditions solving the problem of meat, salt and time are siblings at the same depth. Arranging them into a lineage would make the picture tidier and the claim false."
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
    "standfirst": "Water, something to flavour it, and one decision that splits the family before any other: whether anything thickens it. Not whether you can see through it: that is a different question, and it gets three of these bowls wrong. Consommé spends an entire technique taking things out until nothing is left but flavour. Egusi spends its technique on ground seed until the bowl is thick enough to eat with your hands. After that it is only ever four more questions — what the liquid is, what does the thickening, whether it arrives hot or cold, and whether it opens the meal or is the meal. None of these is a version of any other.",
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
        "label": "By what the liquid is",
        "by": [
          "base",
          "body",
          "served"
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
            "unthickened",
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
            "fish stock",
            "kombu",
            "katsuobushi"
          ],
          "body": [
            "unthickened",
            "clouded by miso in suspension"
          ],
          "served": [
            "hot"
          ],
          "role": [
            "part of the meal"
          ],
          "region": [
            "Japan"
          ]
        },
        "note": "The stock is dashi and takes twenty minutes: kombu drawn out before it boils, katsuobushi steeped and strained. The miso is whisked in off the boil and never simmered — heat it and the aroma and the live culture go together. Nothing thickens it; the cloud is miso held in suspension, and it settles if the bowl stands. Not a course but one of several bowls that arrive at once."
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
            "unthickened",
            "slicked with chilli jam"
          ],
          "served": [
            "hot"
          ],
          "role": [
            "part of the meal"
          ],
          "region": [
            "Thailand"
          ]
        },
        "note": "Nothing thickens it — in the older reading, nam sai, sour and heat do the work a thickener does elsewhere. The orange on top is fat from chilli jam and not body."
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
            "unthickened"
          ],
          "served": [
            "hot"
          ],
          "role": [
            "part of the meal"
          ],
          "region": [
            "Philippines"
          ]
        },
        "note": "Sourness is the structure, not a seasoning: tamarind most often, but guava, green mango or kamias depending on the house and the month. Nothing is added to bind it — a sour broth first and a pork dish second."
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
            "unthickened"
          ],
          "served": [
            "hot",
            "tortilla strips added at the table"
          ],
          "role": [
            "a starter"
          ],
          "region": [
            "Mexico"
          ]
        },
        "note": "Yucatecan, and the lima agria is floral and faintly bitter rather than sharp, which is why a Persian lime does not stand in cleanly. The broth is left as it comes off the bones; the fried tortilla goes in a few strips at a time so it never has time to soften."
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
            "unthickened"
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
        "note": "The sour is the point and traditionally it is not vinegar but beet kvas, fermented weeks ahead. Nothing thickens it: the roots go in grated so they cook fast and stay distinct, and the liquid stays a broth you could pour — what richness the bowl has arrives at the table in a spoon of smetana, so the last decision about it belongs to whoever is eating. A Ukrainian table calls it persha strava, the first course, but it is filed here as the meal because the pot is cooked in quantity and eaten with bread as supper for days after."
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
        "name": "Suan la tang",
        "facets": {
          "base": [
            "meat stock",
            "pork",
            "white pepper",
            "soured with black vinegar"
          ],
          "body": [
            "thickened",
            "a starch slurry stirred in"
          ],
          "served": [
            "hot"
          ],
          "role": [
            "part of the meal"
          ],
          "region": [
            "China"
          ]
        },
        "note": "Starch added as starch: cornflour slaked in cold water and stirred into simmering stock, where it sets the broth without clouding it. You can still see the spoon through it and it is still thickened, which is the case that decides what this family forks on. The heat is white pepper rather than chilli and the sour is black vinegar, both going in off the heat so neither cooks away."
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
            "the pulses cooked to collapse",
            "a flour-and-water tadouira poured in at the end"
          ],
          "served": [
            "hot"
          ],
          "role": [
            "a starter",
            "eaten to break the fast"
          ],
          "region": [
            "Morocco"
          ]
        },
        "note": "Harira means silk, and the tadouira is what earns the name — flour whisked cold into water and streamed into the simmering pot. The lentils and chickpeas have already done half the thickening before it arrives. At iftar it is what the fast is broken with, dates alongside it and the rest of the meal after, so it opens rather than ends."
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
            "the pulses cooked to collapse",
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
        "note": "There is no recipe, only a season. Cook whatever the garden has for long enough and the beans fall apart and the pasta gives up its starch: the soup thickens itself and nothing is added to make it do so. A formal Italian table serves it as a primo, but a bowl carrying both beans and pasta is supper on its own, which is how it is filed here."
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
            "part of the meal"
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
            "starch from the potato"
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
            "cream stirred in at the table",
            "capers added at the table"
          ],
          "role": [
            "the meal"
          ],
          "region": [
            "Colombia"
          ]
        },
        "note": "Bogotá's bowl, and three potatoes doing three jobs: papa criolla falls apart and thickens the pot while pastusa and sabanera hold their shape. Without guascas this is chicken and potato soup with a different name. The cream and the capers are two separate decisions taken at the table — one enriches, the other cuts."
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
            "stale bread blended in",
            "olive oil emulsified in"
          ],
          "served": [
            "cold"
          ],
          "role": [
            "a starter"
          ],
          "region": [
            "Spain"
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
            "cream blended in"
          ],
          "served": [
            "cold",
            "chives snipped over at the end"
          ],
          "role": [
            "a starter"
          ],
          "region": [
            "United States",
            "New York"
          ]
        },
        "note": "Parmentier sieved finer, enriched with cream and chilled, chives snipped over at the end — put together in a New York hotel by a French chef remembering the soup his mother cooled with milk. It is filed where it was made rather than where its parent comes from. It genuinely descends from parmentier; nothing else in this table descends from anything."
      }
    ],
    "notes": [
      {
        "title": "On thickened and not",
        "body": "The family forks once, early, and everything else follows: does anything thicken it. Transparency is the tempting test and the wrong one — miso clouds a bowl that nothing has thickened, tom yum carries a slick of chilli jam on a liquid with no body at all, and suan la tang is thickened with cornflour and still lets you see the spoon. Unthickened is the expensive answer: consommé spends hours and a raft of egg white taking out solids that were already in the pot, and tom yum, sinigang and borscht get their weight from acid because nothing has been added to give them any. Thickened is the domestic answer, and almost always the answer given by a soup that has to be the whole meal — something in the bowl is asked to fall apart."
      },
      {
        "title": "On what does the thickening",
        "body": "Ground melon seed, pulses cooked to collapse, stale bread, a cornflour slurry, a flour-and-water tadouira streamed in at the end, an egg beaten with lemon, a potato chosen because it disintegrates, leek and potato pushed through a sieve, a roux, the starch shed by pasta. Only three bowls here reach for a thickener as a thickener — harira's tadouira, the roux in a chowder, the slurry in suan la tang — and only the last of those is starch arriving as starch rather than as flour. Everywhere else the thickener is something that was going in anyway and is simply cooked past the point where it keeps its shape. That is the whole trick, and it is why most of these soups have no thickening step you could point at in the method."
      },
      {
        "title": "On what the liquid is",
        "body": "Most of these begin with a stock, which is to say the flavouring was made somewhere else and brought to the pot — meat, shellfish, or a dashi of kombu and katsuobushi that takes twenty minutes rather than a morning. Two do not. Dal is pulses and water and gazpacho is raw vegetables and their own juice, so in both the liquid and the ingredient are the same thing and there is nothing to make in advance. Minestrone, parmentier and vichyssoise sit between: plain water that becomes stock while the soup cooks."
      },
      {
        "title": "On cold",
        "body": "Two bowls here are cold, and neither is a hot soup that was left to cool. Chilling flattens salt and mutes aroma, so a cold soup is seasoned harder and carries more acid and more fat than the same bowl would hot. Gazpacho was never heated at all and is built around vinegar and olive oil. Vichyssoise is parmentier deliberately rebalanced for the cold with cream and a finer sieve. Chill an ordinary leek and potato soup and you get neither of them — you get an underseasoned one."
      },
      {
        "title": "On starter or meal",
        "body": "Whether soup opens the meal or is the meal is a fact about the table, not about the soup. The French order that puts it first is a nineteenth-century service convention, and it does not travel: miso shiru, tom yum, sinigang, suan la tang and dal are neither starter nor meal but one component of a set, arriving with everything else and eaten in alternation with rice or bread. Harira is filed as a starter for a different reason again — at iftar it is what the fast is broken with, dates alongside it, and the eating goes on long after the bowl. Egusi is thick enough to be a sauce and is eaten with the hands by way of a swallow. Minestrone and borscht are filed against their own home service, where each is a first course — a primo, a persha strava — because the pot in both cases is cooked in quantity to be supper, and the formal order is the exception rather than the rule. The same pot changes category by crossing a border."
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
        "label": "Hot and sour soup (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Hot_and_sour_soup"
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
      "sopa de lima",
      "suan la tang",
      "hot and sour",
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
    "slug": "vinaigrette",
    "name": "Vinaigrette",
    "standfirst": "Oil and something sour, beaten together and poured over something else. Four decisions separate everything here: which fat, which acid, whether anything is asked to hold the two together, and what else goes in the bowl. Dijon does the holding in Paris, bread soaked in vinegar does it in Turin and again in the Canaries, crushed sesame does it in Beirut and again in Tokyo, a spoonful of hot water does it in Sicily — and in Hanoi and Isan nobody puts fat in at all.",
    "root": "Fat · acid · salt — and a decision about whether the two are made to stay together",
    "facets": [
      {
        "id": "fat",
        "label": "The fat"
      },
      {
        "id": "acid",
        "label": "The acid"
      },
      {
        "id": "bind",
        "label": "Held together by"
      },
      {
        "id": "aroma",
        "label": "Aromatics"
      },
      {
        "id": "region",
        "label": "Region"
      }
    ],
    "nestings": [
      {
        "label": "By what holds it together",
        "by": [
          "bind",
          "fat",
          "acid"
        ]
      },
      {
        "label": "By the fat",
        "by": [
          "fat",
          "acid",
          "aroma"
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
        "name": "Vinaigrette",
        "facets": {
          "region": [
            "France"
          ],
          "fat": [
            "olive oil",
            "mild rather than peppery",
            "three parts to one of vinegar",
            "neutral oil where the leaves are delicate"
          ],
          "acid": [
            "wine vinegar"
          ],
          "bind": [
            "mustard",
            "Dijon",
            "whisked until it turns pale and thick"
          ],
          "aroma": [
            "shallot",
            "black pepper"
          ]
        },
        "note": "The mustard is the whole trick: a teaspoon of it will hold three tablespoons of oil against one of vinegar, whisked until the dressing turns pale and thick and holding that way for about an hour. Without it you are shaking a jar and racing to the table. Everything else is negotiable — red wine vinegar or white, sherry vinegar in the south, a neutral oil where the leaves are too delicate for olive, the shallot chopped fine and left to soften in the vinegar while you work. Take the mustard out and the dressing stops being French."
      },
      {
        "name": "Ravigote",
        "parent": "Vinaigrette",
        "facets": {
          "region": [
            "France"
          ],
          "fat": [
            "olive oil",
            "mild rather than peppery",
            "three parts to one of vinegar"
          ],
          "acid": [
            "wine vinegar"
          ],
          "bind": [
            "mustard",
            "Dijon"
          ],
          "aroma": [
            "shallot",
            "capers",
            "parsley",
            "chervil",
            "tarragon",
            "chives"
          ]
        },
        "note": "Vinaigrette plus capers and a fistful of soft herbs — it descends from the dressing rather than from the base, which is why it sits a level down. Spooned over leeks or a poached egg or calf's head. Not to be confused with the hot ravigote of the old repertoire, which is built on a broth or a velouté and has nothing to do with this."
      },
      {
        "name": "Salmoriglio",
        "facets": {
          "region": [
            "Italy",
            "Sicily",
            "Calabria"
          ],
          "fat": [
            "olive oil",
            "green and raw",
            "a glassful to one lemon"
          ],
          "acid": [
            "lemon juice",
            "squeezed to order"
          ],
          "bind": [
            "hot water",
            "a spoonful beaten in while everything is still warm",
            "cloudy while it is warm"
          ],
          "aroma": [
            "oregano",
            "dried and rubbed between the palms",
            "garlic",
            "parsley in Calabria"
          ]
        },
        "note": "The name comes from salamoia — brine — and in Trapani the water beaten into it was once sea water off the rocks. Hot water is a feeble emulsifier and that is the point: the sauce clouds as it is beaten, slackens again as it cools, and is poured over swordfish the moment it leaves the grill rather than asked to hold."
      },
      {
        "name": "Sauce vierge",
        "facets": {
          "region": [
            "France"
          ],
          "fat": [
            "olive oil",
            "green and raw",
            "a lot of it",
            "warmed to blood heat"
          ],
          "acid": [
            "lemon juice"
          ],
          "bind": [
            "nothing"
          ],
          "aroma": [
            "tomato",
            "peeled and diced raw",
            "basil",
            "coriander seed cracked not ground"
          ]
        },
        "note": "Michel Guérard put it on menus in the nouvelle cuisine years and his name has stuck to it, but the mixture is older than that and Mediterranean, and he cooked at Eugénie-les-Bains in the Landes — Provence here is an idiom rather than an address. Nothing binds it: it is left to separate on purpose and spooned so that both layers land on the plate. Warm it past blood heat and the tomato weeps and the basil blackens, so this is a dressing that has been shown the pan rather than cooked in it."
      },
      {
        "name": "Salsa verde",
        "facets": {
          "region": [
            "Italy",
            "Piedmont",
            "Lombardy"
          ],
          "fat": [
            "olive oil",
            "green and raw",
            "a lot of it"
          ],
          "acid": [
            "wine vinegar",
            "red",
            "the bread drinks most of it"
          ],
          "bind": [
            "bread",
            "crustless crumb soaked in the vinegar",
            "squeezed dry before it goes in"
          ],
          "aroma": [
            "parsley",
            "by the bunch",
            "capers",
            "anchovy",
            "garlic"
          ]
        },
        "note": "Bagnet verd in Piedmont, where a hard-boiled yolk usually goes in as well. The bread does two jobs — it holds the oil and it holds the sauce still on a slice of boiled beef — and it is why this lands on the plate as a relish rather than a dressing. Not the Mexican salsa verde, which is tomatillos and chillies with no oil in it at all."
      },
      {
        "name": "Chimichurri",
        "facets": {
          "region": [
            "Argentina",
            "Uruguay"
          ],
          "fat": [
            "olive oil"
          ],
          "acid": [
            "wine vinegar",
            "red",
            "enough that it stings"
          ],
          "bind": [
            "nothing"
          ],
          "aroma": [
            "parsley",
            "dried oregano",
            "garlic",
            "ají molido"
          ]
        },
        "note": "The dried oregano is what separates it from every other green herb sauce. Nothing binds it: the herbs are chopped with a knife rather than blended, the jar is shaken at the table, and a day's standing only improves it as the parsley bleeds into the vinegar. The oil is as often sunflower as olive. Blend it and you get a smooth green emulsion tasting of nothing in particular; the knife leaves the parsley in pieces that stay parsley."
      },
      {
        "name": "Mojo picón",
        "facets": {
          "region": [
            "Spain",
            "Canary Islands"
          ],
          "fat": [
            "olive oil"
          ],
          "acid": [
            "wine vinegar",
            "white",
            "let down with water if it thickens too far"
          ],
          "bind": [
            "bread",
            "crustless crumb soaked in the vinegar",
            "garlic worked to a cream first"
          ],
          "aroma": [
            "garlic",
            "cumin",
            "pimienta picona",
            "pimentón"
          ]
        },
        "note": "The same solution as salsa verde, reached again a thousand miles away in the Atlantic with no traffic between them: bread soaked in the vinegar and pounded into the oil, which goes into the mortar last of all. Swap the dried red pepper for coriander leaf and the same mortar gives you mojo verde."
      },
      {
        "name": "Chermoula",
        "facets": {
          "region": [
            "Morocco",
            "Algeria"
          ],
          "fat": [
            "olive oil"
          ],
          "acid": [
            "lemon juice",
            "preserved lemon in some houses",
            "a splash of vinegar"
          ],
          "bind": [
            "nothing"
          ],
          "aroma": [
            "coriander leaf",
            "flat parsley",
            "garlic",
            "cumin",
            "sweet paprika"
          ]
        },
        "note": "A marinade before it is a sauce: fish sits packed in it for an hour before it goes near charcoal, and what is left in the dish is spooned back over at the table. Nothing binds it and it is stirred rather than whisked, but cumin and paprika do the work an emulsifier would — ground spice held in suspension makes a sauce that clings without ever being bound. In the Souss the oil is argan rather than olive."
      },
      {
        "name": "Nar ekşili sos",
        "facets": {
          "region": [
            "Turkey",
            "Gaziantep"
          ],
          "fat": [
            "olive oil"
          ],
          "acid": [
            "pomegranate molasses",
            "juice boiled down to a syrup",
            "sweet as well as sour"
          ],
          "bind": [
            "nothing"
          ],
          "aroma": [
            "sumac",
            "dried mint",
            "pul biber"
          ]
        },
        "note": "The only acid here that arrives already thickened. Boiling pomegranate juice to a syrup concentrates the sugar along with the sourness, so nothing has to be added to give the dressing body — it is shaken to order and the syrup carries itself. That is also why it wants sumac, a sourness with no sugar attached, to stop it reading as a glaze. Poured over gavurdağı and kısır."
      },
      {
        "name": "Tarator",
        "facets": {
          "region": [
            "Levant",
            "Lebanon",
            "Palestine"
          ],
          "fat": [
            "sesame paste",
            "milled from lightly roasted hulled seed",
            "tahini"
          ],
          "acid": [
            "lemon juice",
            "a great deal of it",
            "in before the water"
          ],
          "bind": [
            "the paste itself",
            "seizes solid on contact",
            "loosened with cold water",
            "stays bound for days"
          ],
          "aroma": [
            "garlic",
            "crushed to a paste with salt",
            "cumin in some houses",
            "parsley"
          ]
        },
        "note": "The seizing frightens people into throwing it away. Tahini and lemon go stiff and pale and grainy on contact — that is the emulsion forming, not breaking — and cold water a spoonful at a time takes it back to a pourable cream. Also written taratour. The Bulgarian tarator is a cold cucumber and yogurt soup, and the Turkish tarator it shares a name with is walnuts pounded with bread and garlic and vinegar — a third instance of the bread bind, and neither of them is this."
      },
      {
        "name": "Goma dare",
        "facets": {
          "region": [
            "Japan"
          ],
          "fat": [
            "sesame paste",
            "milled from seed roasted far darker",
            "neri goma"
          ],
          "acid": [
            "rice vinegar",
            "mild",
            "a small share of the bowl"
          ],
          "bind": [
            "the paste itself",
            "let down with dashi",
            "stays bound"
          ],
          "aroma": [
            "soy sauce",
            "mirin",
            "sugar",
            "grated ginger"
          ]
        },
        "note": "Tarator and goma dare are the same discovery made twice. Crushed sesame is about half oil by weight and the rest is protein and fibre that will hold that oil in water. What differs is the roast: Levantine tahini is milled from lightly roasted seed and tastes green and faintly bitter, neri goma from seed roasted far darker and tastes of the toast."
      },
      {
        "name": "Ponzu",
        "facets": {
          "region": [
            "Japan"
          ],
          "fat": [
            "no fat at all"
          ],
          "acid": [
            "citrus juice",
            "yuzu"
          ],
          "bind": [
            "nothing"
          ],
          "aroma": [
            "kombu",
            "katsuobushi",
            "mirin"
          ]
        },
        "note": "Pon is the Dutch pons — punch — left behind by the only Europeans Japan traded with for two hundred years; the su on the end is vinegar. Yuzu is the usual citrus, sudachi and kabosu where they grow, and a little rice vinegar steadies the juice; the kombu and the katsuobushi steep in it cold overnight and are strained out before it is poured. Nothing binds it and nothing is meant to, since it is supposed to stay thin enough to see through. The savour comes from kombu and dried bonito rather than from fat, which is how a sauce with no oil in it still coats a slice of raw fish."
      },
      {
        "name": "Ponzu shoyu",
        "parent": "Ponzu",
        "facets": {
          "region": [
            "Japan"
          ],
          "fat": [
            "no fat at all"
          ],
          "acid": [
            "citrus juice",
            "yuzu"
          ],
          "bind": [
            "nothing"
          ],
          "aroma": [
            "kombu",
            "katsuobushi",
            "mirin",
            "soy sauce"
          ]
        },
        "note": "Ponzu plus soy sauce — and what nearly every bottle labelled ponzu actually contains. It sits a level down because it genuinely is the other one plus something: the citrus, the vinegar and the steeping are unchanged, and the dark colour and most of the salt arrive with the soy."
      },
      {
        "name": "Nước chấm",
        "facets": {
          "region": [
            "Vietnam"
          ],
          "fat": [
            "no fat at all"
          ],
          "acid": [
            "lime juice",
            "rice vinegar in the north"
          ],
          "bind": [
            "nothing"
          ],
          "aroma": [
            "fish sauce",
            "garlic",
            "bird chilli",
            "palm sugar"
          ]
        },
        "note": "Water is an ingredient here rather than an accident. Fish sauce and lime go in at full strength and are then let down almost to a drink, because the sauce is poured over a bowl of noodles rather than tossed through leaves. Nothing binds it and what body it has comes from the sugar. The garlic is chopped rather than crushed so that it floats."
      },
      {
        "name": "Nam jim jaew",
        "facets": {
          "region": [
            "Thailand",
            "Isan",
            "Laos"
          ],
          "fat": [
            "no fat at all"
          ],
          "acid": [
            "lime juice",
            "tamarind in some houses"
          ],
          "bind": [
            "toasted rice powder",
            "khao khua",
            "grit in suspension rather than an emulsion"
          ],
          "aroma": [
            "fish sauce",
            "dried chilli flakes",
            "palm sugar",
            "spring onion",
            "coriander"
          ]
        },
        "note": "Sticky rice dry-toasted to dark brown and ground coarse. It thickens by absorption rather than emulsion and it is the only body the sauce has, which is why jaew is gritty on the tongue in a way nước chấm never is. Made the same day it is eaten — the powder goes soft and stale overnight."
      },
      {
        "name": "Yangnyeomjang",
        "facets": {
          "region": [
            "Korea"
          ],
          "fat": [
            "sesame oil",
            "toasted",
            "a spoonful rather than a cupful"
          ],
          "acid": [
            "rice vinegar",
            "a smaller share than the soy"
          ],
          "bind": [
            "nothing"
          ],
          "aroma": [
            "soy sauce",
            "gochugaru",
            "garlic",
            "spring onion",
            "toasted sesame seed"
          ]
        },
        "note": "The one place where the fat is the seasoning rather than the body. Toasted sesame oil is too loud to pour by the cupful, so the ratio inverts — soy sauce is the bulk, vinegar the acid, and the oil goes in by the spoon for its smell. Nothing holds it together and nothing needs to: the seed settles to the bottom and it is stirred again at the table. Spooned over cold tofu or steamed greens and set beside dumplings."
      }
    ],
    "notes": [
      {
        "title": "On what holds it together",
        "body": "Oil and vinegar separate because that is what they do; anything that keeps them mixed is a third substance with a foot in both phases. Mustard brings mucilage off the seed coat. Crushed sesame brings protein and lecithin, which is why tahini and neri goma emulsify without help from anywhere else. Bread and toasted rice bring starch that swells and traps oil in a mesh rather than truly emulsifying it. Hot water in salmoriglio brings almost nothing and buys ten minutes. And half this family declines to bother — eight of these sixteen answer the question with nothing at all. Sauce vierge and chimichurri and chermoula are meant to be seen separating in the spoon and are stirred again at the table; nar ekşili sos and nước chấm get what body they have from sugar rather than from any emulsifier."
      },
      {
        "title": "On the fat that is not there",
        "body": "Ponzu, nước chấm and nam jim jaew have no oil in them and are still doing a vinaigrette's job. Fat in a dressing carries aroma, coats what it touches, and blunts the acid so it does not strip the tongue. In the fish sauce sauces the blunting is done by sugar and by water — nước chấm is let down almost to a drink — and the carrying is done by glutamate, which is also why ponzu steeps kombu and bonito in the citrus for a day before anyone tastes it. Yangnyeomjang splits the difference: sesame oil by the spoonful, in for smell rather than for body."
      },
      {
        "title": "On depth",
        "body": "Only ravigote and ponzu shoyu sit under anything, because only they are genuinely another sauce on this page plus something — ravigote is vinaigrette with capers and soft herbs, ponzu shoyu is ponzu with soy sauce in it. Everything else is one decision away from oil and acid and belongs at the same depth. Tarator and goma dare both bind with crushed sesame and are not related. Salsa verde and mojo picón both bind with bread soaked in vinegar and are not related either. Two kitchens with no knowledge of each other arriving at the same answer is the ordinary case in this family rather than the interesting exception."
      },
      {
        "title": "On the ones next door",
        "body": "Keep whisking oil into egg yolk until there is no water phase left to speak of and you have left this family for mayonnaise — a sauce you spread rather than pour. Pound the herbs to a paste with cheese and nuts and you are in pesto. Gremolata is not here at all: lemon zest, parsley and garlic chopped together have no fat and no liquid acid, so nothing is dressed and nothing is emulsified — a dry garnish that happens to share three ingredients with half this page. Leche de tigre looks like a fat-free vinaigrette and is really a cure, since its job is to firm the fish rather than to season it."
      }
    ],
    "sources": [
      {
        "label": "Vinaigrette (Wikipedia)",
        "url": "https://en.wikipedia.org/wiki/Vinaigrette"
      },
      {
        "label": "Sauce ravigote",
        "url": "https://en.wikipedia.org/wiki/Ravigote"
      },
      {
        "label": "Salmoriglio",
        "url": "https://en.wikipedia.org/wiki/Salmoriglio"
      },
      {
        "label": "Salmoriglio: history and recipe (Forager Chef)",
        "url": "https://foragerchef.com/bergamot-salmoriglio-sauce/"
      },
      {
        "label": "Sauce vierge",
        "url": "https://en.wikipedia.org/wiki/Sauce_vierge"
      },
      {
        "label": "Salsa verde",
        "url": "https://en.wikipedia.org/wiki/Salsa_verde"
      },
      {
        "label": "Chimichurri",
        "url": "https://en.wikipedia.org/wiki/Chimichurri"
      },
      {
        "label": "Mojo (sauce)",
        "url": "https://en.wikipedia.org/wiki/Mojo_(sauce)"
      },
      {
        "label": "Los mojos canarios (Cultura Tradicional de Gran Canaria)",
        "url": "https://culturatradicionalgc.org/mojos/"
      },
      {
        "label": "Chermoula",
        "url": "https://en.wikipedia.org/wiki/Chermoula"
      },
      {
        "label": "Nar ekşisi as a dressing (Exploring the Turkish Kitchen)",
        "url": "https://exploringtheturkishkitchen.com/index.php/turkish-ingredients-produce/117-nar-eksisi-sos-pomegranate-molasses"
      },
      {
        "label": "Tahini",
        "url": "https://en.wikipedia.org/wiki/Tahini"
      },
      {
        "label": "Goma-ae and sesame dressing",
        "url": "https://en.wikipedia.org/wiki/Goma-ae"
      },
      {
        "label": "Ponzu",
        "url": "https://en.wikipedia.org/wiki/Ponzu"
      },
      {
        "label": "Eat This Word: Ponzu (James Beard Foundation)",
        "url": "https://www.jamesbeard.org/stories/eat-this-word-ponzu"
      },
      {
        "label": "Nước chấm",
        "url": "https://en.wikipedia.org/wiki/N%C6%B0%E1%BB%9Bc_ch%E1%BA%A5m"
      },
      {
        "label": "Nam chim",
        "url": "https://en.wikipedia.org/wiki/Nam_chim"
      },
      {
        "label": "Yangnyeomjang (Tasting Table)",
        "url": "https://www.tastingtable.com/1403438/yangnyeomjang-korean-seasoning-sauce-explained/"
      },
      {
        "label": "Emulsion",
        "url": "https://en.wikipedia.org/wiki/Emulsion"
      }
    ],
    "yours": [
      "vinaigrette",
      "dressing",
      "salad dressing",
      "ravigote",
      "salmoriglio",
      "sauce vierge",
      "salsa verde",
      "chimichurri",
      "mojo",
      "chermoula",
      "tahini dressing",
      "tarator",
      "taratour",
      "goma",
      "sesame dressing",
      "ponzu",
      "nuoc cham",
      "nước chấm",
      "nam jim",
      "yangnyeomjang"
    ]
  },
  {
    "slug": "wrapped-parcel",
    "name": "Wrapped in a leaf",
    "standfirst": "A leaf is the oldest cooking vessel there is. Close one around a paste, a handful of grain or a loose filling and it does four jobs at once — holds a shapeless paste until it sets, keeps the water out while letting the steam in, survives fire, and gives back its own flavour. Every warm country worked this out, and the leaf it had to hand is most of what separates the results.",
    "root": "A body closed inside a leaf or husk and cooked in it",
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
        "note": "The same problem as a tamal, answered with this season's corn: fresh kernels milled raw rather than dried corn nixtamalised. Sweeter and wetter, wrapped in a green husk rather than last season's dried one, and tied shut at both ends rather than tucked under."
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
            "precooked corn flour",
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
        "note": "The dough is masarepa — corn flour cooked and dried before it ever reaches the kitchen, the same dough as an arepa, kneaded with broth and annatto lard rather than limed at home. The guiso is stewed the day before and laid on it rather than mixed through, so the parcel keeps two layers apart until you untie it. Tied tight enough to be boiled rather than steamed."
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
            "Mesoamerica",
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
            "China",
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
            "China",
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
        "note": "Layered rice, bean, pork, bean, rice, so the cut face reads as rings. The stiff midrib of the dong leaf is what lets it hold a square with no mould, and it is the only one here still being shaped after the heat is off — pressed under a board to drive the water out."
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
            "Indonesia"
          ]
        },
        "note": "No filling at all — here the leaf is purely a mould. Rice boiled with nowhere to expand compacts into a cake dense enough to slice, which is what makes it a vehicle for satay sauce rather than a bowl of rice. Indonesian and just as much Malaysian, under the same name."
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
            "Indonesia",
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
            "Malay peninsula"
          ]
        },
        "note": "The same leaf and the same flat pinned packet as pepes ikan, arrived at separately: here the fish is pounded to a paste with coconut milk, and the coals do all the cooking rather than finishing it. The paste needs containing where the pieces did not — and it sets into a slab you can pick up by the leaf. Singapore grills it as its own, not as a borrowing."
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
            "Eastern Mediterranean"
          ]
        },
        "note": "One of the wrappers here you are meant to eat, and the only one brined rather than merely softened for it. Nothing ties it shut; a plate laid over the pan does the work a string does elsewhere. Anatolia, the Levant and the Balkans all claim it, each under its own name."
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
            "fried in slices"
          ],
          "region": [
            "Gujarat"
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
            "in an earth oven",
            "hours over hot stones"
          ],
          "region": [
            "Hawaiʻi"
          ]
        },
        "note": "Two leaves doing two jobs: the lūʻau leaves inside collapse into the pork and are eaten, the ti leaf outside is structure and is not. The imu is the same idea as the pib, an ocean west."
      }
    ],
    "notes": [
      {
        "title": "The leaf is equipment",
        "body": "It is tempting to read the wrapper as packaging. It is not — it is the pot. It holds a paste that has no shape of its own, it lets steam in and keeps boiling water out, it takes direct fire without burning what it holds, and it seasons. That last job is why the same glutinous rice reads as zongzi in bamboo and as lo mai gai in lotus: nothing about the grain changed, and the leaf is doing the seasoning."
      },
      {
        "title": "Paste or grain or pieces",
        "body": "The fork that decides everything downstream. A paste has to be contained until heat sets it, so paste parcels are folded tight and usually tied — untie a raw one and it runs. Whole grains need packing and a long wet cook to fuse. A loose filling only needs holding, which is why a vine leaf rolled into a cigar with nothing to close it is enough for dolma, and would be nowhere near enough for a tamal. Some parcels have no filling at all: lontong, kenkey and jianshui zong are a body and a wrapper and nothing else, and the leaf is working purely as a mould."
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
