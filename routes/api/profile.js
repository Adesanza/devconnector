const express = require("express");
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { response } = require("express");

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server went Bad");
  }
});

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        Instagram,
        Linkedin
    } = req.body;


    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills){
        profileFields.skills = skills.split(',').map(skills => skills.trim());
    }

    profileFields.social = {}
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(Linkedin) profileFields.social.Linkedin = Linkedin;
    if(Instagram) profileFields.social.Instagram = Instagram;

   try{
    let profile = await Profile.findOne({user: req.user.id});

    if(profile){
        profile = await Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new: true});
        return res.json(profile);
    }

    profile = new Profile(profileFields);

    await profile.save();
    res.json(profile);
   }catch(err){
       console.error(err.message);
       res.status(500).send('Server went Bad')
   }
  }
);

router.get('/', async(req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
            res.status(500).send('Server went bad')
    }
});

// GET API/PROFILE/USER_ID {ROUT}///// 

router.get('/user/:user_id', async(req, res) => {
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);
        
        if(!profile) return res.status(400).json({msg: 'No Profile '});

    return res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: "No Profile "});
        }
            res.status(500).send('Server went bad')
    }
});


// DELETE PROFILE, USERS AND POSTS & ACESSS IS PRIVATE
router.delete('/', auth, async(req, res) => {
    try {
        await Profile.findOneAndRemove({user: req.user.id});
        await User.findOneAndRemove({_id: req.user.id});
        res.json({msg: 'User Deleted'});
    } catch (err) {
        console.error(err.message);
            res.status(500).send('Server went bad')
    }
});


// EXPERIENCE 
router.put(
    '/experience',
    [
        auth,
        [
            check('title', 'Title is required')
            .not()
            .isEmpty(),
            check('company', 'Company is required')
            .not()
            .isEmpty(),
            check('from', 'From Date is required')
            .not()
            .isEmpty(),
            
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }
        try {
            const profile = await Profile.findOne({user: req.user.id});

            profile.experience.unshift(newExp);

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message).res.status(500).send('Server went Bad');
            
        }
    }
);

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id});
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server went Bad");
        
    }
});


// EDUCATION

router.put(
    '/education',
    [
        auth,
        [
            check('school', 'School is required')
            .not()
            .isEmpty(),
            check('degree', 'Degree is required')
            .not()
            .isEmpty(),
            check('fieldofstudy', 'Field of Study is required')
            .not()
            .isEmpty(),
            check('from', 'From Date is required')
            .not()
            .isEmpty(),
            
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }
        try {
            const profile = await Profile.findOne({user: req.user.id});

            profile.education.unshift(newEdu);

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message).res.status(500).send('Server went Bad');
            
        }
    }
);

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id});
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server went Bad");
        
    }
})

// GET REQUEST TO PROFILE OF GITHUB

router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=8sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        };

        request(options, (err, response, body) => {
            if(err) console.error(err);

            if(response.statusCode !== 200){
               return res.status(404).json({msg: 'No GitHub profile Found'});
            }

            res.json(JSON.parse(body));
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server went Bad');
        
    }
})


module.exports = router;
