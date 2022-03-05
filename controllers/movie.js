// create a reference to the model
const movie = require("../models/movie");
let Movie = require("../models/movie");

// Gets all movies from the Database and renders the page to list all movies.
module.exports.movieList = function (req, res, next) {
  Movie.find((err, movieList) => {
    if (err) {
      return console.error(err);
    } else {
      res.render("movie/list", {
        title: "Movie List",
        movies: movieList,
      });
    }
  });
};

// Gets a movie by id and renders the details page.
module.exports.details = (req, res, next) => {
  let id = req.params.id;

  Movie.findById(id, (err, movieToShow) => {
    if (err) {
      res.end(err);
    } else {
      //show the edit view
      res.render("movie/details", {
        title: "Movie Details",
        movie: movieToShow,
      });
    }
  });
};

// Renders the Add form using the add_edit.ejs template
module.exports.displayAddPage = (req, res, next) => {
  res.render('movie/add_edit', {
    title: 'Add Page',
    movie: {},
  });
};

// Processes the data submitted from the Add form to create a new movie
module.exports.processAddPage = (req, res, next) => {
  let mov = new Movie(req.body);
  mov.save();
  res.redirect('/movie/list');
};

// Gets a movie by id and renders the Edit form using the add_edit.ejs template
module.exports.displayEditPage = async (req, res, next) => {
  let idMovie = req.params.id;
  let resMovie = await movie.findById(idMovie);

  res.render('movie/add_edit', {
    title: 'Edit',
    //using a thernary operator in case resMovie is null/undefined
    movie: resMovie ? resMovie : {},
  });
};

// Processes the data submitted from the Edit form to update a movie
module.exports.processEditPage = async (req, res, next) => {
  let idMovie = req.params.id;
  let resMovie = await movie.findById(idMovie);
  await resMovie.overwrite(req.body);
  await resMovie.save();
  res.redirect('/movie/list');
};

// Deletes a movie based on its id.
module.exports.performDelete = async (req, res, next) => {
  let idMovie = req.params.id;
  await movie.deleteOne({
    _id: idMovie
  });
  res.redirect('/movie/list');
};