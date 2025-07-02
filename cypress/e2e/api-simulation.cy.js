describe('Simulasi API dengan Membaca Langsung dari File Fixture', () => {

  it('1. SIMULASI POST - Memverifikasi data respons dari fixture', () => {
    // Langkah 1: Muat file fixture kita
    cy.fixture('api-responses.json').then((responses) => {
      
      // Langkah 2: Ambil data respons spesifik yang ingin kita uji
      const fakePostResponse = responses.createUserSuccess;
      cy.log('Data yang dibaca:', fakePostResponse);

      // Langkah 3: Lakukan verifikasi langsung pada data tersebut
      expect(fakePostResponse.statusCode).to.eq(201);
      expect(fakePostResponse.body.name).to.eq('Budi dari Fixture');
      expect(fakePostResponse.body).to.have.property('id');
    });
  });

  it('2. SIMULASI PUT - Memverifikasi data respons dari fixture', () => {
    cy.fixture('api-responses.json').then((responses) => {
      const fakePutResponse = responses.updateUserSuccess;
      cy.log('Data yang dibaca:', fakePutResponse);

      expect(fakePutResponse.statusCode).to.eq(200);
      expect(fakePutResponse.body.job).to.eq('Lead QA');
    });
  });

  it('3. SIMULASI DELETE - Memverifikasi data respons dari fixture', () => {
    cy.fixture('api-responses.json').then((responses) => {
      const fakeDeleteResponse = responses.deleteUserSuccess;
      cy.log('Data yang dibaca:', fakeDeleteResponse);

      expect(fakeDeleteResponse.statusCode).to.eq(204);
      expect(fakeDeleteResponse.body).to.be.empty; // Pastikan body kosong
    });
  });

});