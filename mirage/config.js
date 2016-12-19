export default function() {
  this.namespace = '/api/index.php';    // make this `api`, for example, if your API is namespaced
  this.timing = 400;      // delay for each request, automatically set to 0 during testing

  this.get('/polls/:id');
  this.post('/polls');
  this.post('/users');
}
