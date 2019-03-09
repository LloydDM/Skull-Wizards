var prompt = require('prompt');
var fs = require('fs');
var path = require('path');

var schema = {
  properties: {
    class_noun: {
      description: 'Non-Proper Noun',
      required: true,
      before: string => string.charAt(0).toUpperCase() + string.slice(1)
    },
    class_roll: {
      description: '1D6 Roll',
      required: true
    },
    race: {
      description: 'Animal, Vegetable, or Mineral',
      required: true,
      before: string => string.charAt(0).toUpperCase() + string.slice(1)
    },
    weapon: {
      description: 'Non-Proper Noun',
      required: true,
      before: string => string.charAt(0).toUpperCase() + string.slice(1)
    },
    weapon_mod: {
      description: '-ing Verb',
      required: true,
      before: string => string.charAt(0).toUpperCase() + string.slice(1)
    },
    background_trait: {
      description: 'Personality Trait or Emotion',
      required: true,
      before: string => string.charAt(0).toUpperCase() + string.slice(1)
    },
    background_job: {
      description: 'A Job',
      required: true,
      before: string => string.charAt(0).toUpperCase() + string.slice(1)
    },
    skill_1: {
      description: '-ing Verb',
      required: true,
      before: string => string.charAt(0).toUpperCase() + string.slice(1)
    },
    skill_2: {
      description: '-ing Verb',
      required: true,
      before: string => string.charAt(0).toUpperCase() + string.slice(1)
    },
    skill_3: {
      description: '-ing Verb',
      required: true,
      before: string => string.charAt(0).toUpperCase() + string.slice(1)
    },
    monster_adj: {
      description: 'Adjective',
      required: true,
      before: string => string.charAt(0).toUpperCase() + string.slice(1)
    },
    monster_monster: {
      description: 'Monster',
      required: true,
      before: string => string.charAt(0).toUpperCase() + string.slice(1)
    },
    monster_mod: {
      description: '-ing Verb or Noun',
      required: true,
      before: string => string.charAt(0).toUpperCase() + string.slice(1)
    },
    sup_noun_1: {
      description: 'Noun',
      required: true,
      before: string => string.charAt(0).toUpperCase() + string.slice(1)
    },
    sup_noun_2: {
      description: 'Noun',
      required: true,
      before: string => string.charAt(0).toUpperCase() + string.slice(1)
    },
    sup_noun_3: {
      description: 'Noun',
      required: true,
      before: string => string.charAt(0).toUpperCase() + string.slice(1)
    },
    sup_noun_4: {
      description: 'Noun',
      required: true,
      before: string => string.charAt(0).toUpperCase() + string.slice(1)
    },
    sup_noun_5: {
      description: 'Noun',
      required: true,
      before: string => string.charAt(0).toUpperCase() + string.slice(1)
    },
    sup_adj_1: {
      description: 'Adjective',
      required: true,
      before: string => string.charAt(0).toUpperCase() + string.slice(1)
    },
    sup_adj_2: {
      description: 'Adjective',
      required: true,
      before: string => string.charAt(0).toUpperCase() + string.slice(1)
    },
    sup_adj_3: {
      description: 'Adjective',
      required: true,
      before: string => string.charAt(0).toUpperCase() + string.slice(1)
    },
    sup_ing_1: {
      description: '-ing Verb or Noun',
      required: true,
      before: string => string.charAt(0).toUpperCase() + string.slice(1)
    },
    sup_ing_2: {
      description: '-ing Verb or Noun',
      required: true,
      before: string => string.charAt(0).toUpperCase() + string.slice(1)
    },
    sup_ing_3: {
      description: '-ing Verb or Noun',
      required: true,
      before: string => string.charAt(0).toUpperCase() + string.slice(1)
    },
    sup_adv_1: {
      description: 'Adverb',
      required: true,
      before: string => string.charAt(0).toUpperCase() + string.slice(1)
    },
    sup_adv_2: {
      description: 'Adverb',
      required: true,
      before: string => string.charAt(0).toUpperCase() + string.slice(1)
    },

  }
};


prompt.start()

prompt.get(schema, (err, madlib) => {
  if (err) console.error(err);

  madlib.main_monster = `${madlib.monster_adj} ${madlib.monster_monster} with the power of ${madlib.monster_mod}`;

  madlib.supplemental_nouns = [
    madlib.sup_noun_1,
    madlib.sup_noun_2,
    madlib.sup_noun_3,
    madlib.sup_noun_4,
    madlib.sup_noun_5
  ];

  madlib.supplemental_adjs = [
    madlib.sup_adj_1,
    madlib.sup_adj_2,
    madlib.sup_adj_3
  ];

  madlib.supplemental_ings = [
    madlib.sup_ing_1,
    madlib.sup_ing_2,
    madlib.sup_ing_3
  ];

  madlib.supplemental_advs = [
    madlib.sup_adv_1,
    madlib.sup_adv_2
  ];

  madlib.created_by = "";

  delete madlib.sup_noun_1;
  delete madlib.sup_noun_2;
  delete madlib.sup_noun_3;
  delete madlib.sup_noun_4;
  delete madlib.sup_noun_5;
  delete madlib.sup_adj_1;
  delete madlib.sup_adj_2;
  delete madlib.sup_adj_3;
  delete madlib.sup_ing_1;
  delete madlib.sup_ing_2;
  delete madlib.sup_ing_3;
  delete madlib.sup_adv_1;
  delete madlib.sup_adv_2;

  console.log('madlib: ', madlib);
  fs.writeFileSync(path.join(__dirname, ('madlibs/madlib_' + new Date().valueOf().toString())), JSON.stringify(madlib));
})


