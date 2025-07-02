describe('API Testing untuk Endpoint Publik reqres.in', () => {

  const baseUrl = 'https://reqres.in/api';

  it('GET - List Users: Seharusnya mengembalikan daftar pengguna dan status 200', () => {
    cy.request('GET', `${baseUrl}/users?page=2`).then((response) => {
      // Verifikasi status code
      expect(response.status).to.eq(200);
      
      // Verifikasi bahwa body respons adalah objek
      expect(response.body).to.be.an('object');

      // Verifikasi properti di dalam body
      expect(response.body).to.have.property('page', 2);
      expect(response.body.data).to.be.an('array');
      expect(response.body.data).to.have.length(6); // reqres.in biasanya mengembalikan 6 user per halaman
    });
  });

  it('GET - Single User: Seharusnya mengembalikan data satu pengguna spesifik', () => {
    // Kita akan mengambil data user dengan id=2
    cy.request('GET', `${baseUrl}/users/2`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.property('id', 2);
      expect(response.body.data).to.have.property('first_name', 'Janet');
    });
  });

  it('GET - Single User Not Found: Seharusnya mengembalikan status 404', () => {
    // Kita sengaja mencari user yang tidak ada (id=23) untuk menguji respons error
    cy.request({
      method: 'GET',
      url: `${baseUrl}/users/23`,
      failOnStatusCode: false // <-- Ini sangat penting!
    }).then((response) => {
      // Kita berharap mendapatkan status 404, bukan 200
      expect(response.status).to.eq(404);
    });
  });

});