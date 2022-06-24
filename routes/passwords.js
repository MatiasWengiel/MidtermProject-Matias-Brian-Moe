const express = require('express');
const router  = express.Router();

const {
  getAllOrganizationalPasswords,
  getAllOrganizationalPasswordsWithinCategory,
  getAllOrganizationalPasswordsFromSearch
} = require('../db/query_functions')

module.exports = (db) => {
  router.get("/", (req, res) => {
    const userId = req.session.userId;
    const orgId = req.session.orgId;
    console.log('org ID is ', orgId)
    db.query(getAllOrganizationalPasswords(orgId))
      .then(data => {
        const passwords = data.rows;

        res.json({ passwords }); //We can change this to render the page showing the PWs
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });


  });

  router.get('/search/categories', (req, res) => {
    const orgId = req.session.orgId;
    db.query(getAllOrganizationalPasswordsWithinCategory(orgId, 3))
    .then(data => {
      const passwords = data.rows;
      res.json({ passwords });
    })
    .catch (err => {
      res
        .status(500)
        .json({error: err.message });
    });
  })

  router.get('/search/:query', (req, res) => {
    const orgId = req.session.orgId;
    const query = req.params.query;
    console.log('The query was ', query)
    db.query(getAllOrganizationalPasswordsFromSearch(orgId, query))
    .then(data => {
      const passwords = data.rows;
      res.json({ passwords });
    })
    .catch (err => {
      res
        .status(500)
        .json({error: err.message });
    });
  })

  router.get('/:id', (req, res) => {

    const passwordId = req.params.id;
    res.send(`<h1>This is the link where you would see the information about a single password</h1><h2>For example, now you'd be seeing the info for ${passwordId}`);
  });

  router.post('/:id', (req, res) => {
    const passwordId = req.params.id;
    res.send(`<h1>You have successfully POSTed for password ID ${passwordId}<h1>`)
  })

  router.post('/', (req, res) => {
    res.send(`<h1>You have successfully POSTed to create a new password</h1>`)
  })

  router.post('/:id/delete', (req, res) => {
    const passwordId = req.params.id;
    res.send(`<h1>You have successfully POSTed to delete password ${passwordId}</h1>`)
  })

  return router;
};
