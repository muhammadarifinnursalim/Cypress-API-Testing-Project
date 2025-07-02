describe('Tes End-to-End untuk UI Aplikasi CRUD dengan Data Simulasi', () => {

  // Muat 'database' kita sekali saja
  before(() => {
    cy.fixture('crud-db.json').as('db');
  });

  // Sebelum setiap tes, siapkan interceptor dan kunjungi halaman
  beforeEach(function() { // Gunakan function() untuk mengakses 'this.db'
    // --- INTERCEPT UNTUK LOGIN ---
    cy.intercept('POST', '**/api/login', (req) => {
      const { email, password } = req.body;
      const validCreds = this.db.loginCredentials.valid;

      if (email === validCreds.email && password === validCreds.password) {
        req.reply(this.db.apiResponses.loginSuccess);
      } else {
        req.reply(this.db.apiResponses.loginFailure);
      }
    }).as('loginRequest');

    // --- INTERCEPT UNTUK CRUD ---
    cy.intercept('GET', '**/api/users', { data: this.db.users }).as('getUsers');
    cy.intercept('POST', '**/api/users', this.db.apiResponses.createUserSuccess).as('createUser');
    cy.intercept('DELETE', '**/api/users/*', this.db.apiResponses.deleteUserSuccess).as('deleteUser');

    // Kunjungi halaman utama
    cy.visit('/index.html');
  });

  context('Halaman Login', () => {
    it('seharusnya menampilkan error jika login dengan kredensial salah', function() {
      const invalidCreds = this.db.loginCredentials.invalid;
      cy.get('[data-cy=input-login-email]').type(invalidCreds.email);
      cy.get('[data-cy=input-login-password]').type(invalidCreds.password);
      cy.get('[data-cy=button-login]').click();
      
      cy.wait('@loginRequest');

      cy.get('[data-cy=message-login]').should('be.visible').and('contain.text', 'user not found');
      cy.get('[data-cy=view-dashboard]').should('not.be.visible');
    });

    it('seharusnya berhasil login dan menampilkan dashboard', function() {
      const validCreds = this.db.loginCredentials.valid;
      cy.get('[data-cy=input-login-email]').type(validCreds.email);
      cy.get('[data-cy=input-login-password]').type(validCreds.password);
      cy.get('[data-cy=button-login]').click();

      cy.wait('@loginRequest');
      
      cy.get('[data-cy=view-login]').should('not.be.visible');
      cy.get('[data-cy=view-dashboard]').should('be.visible');
    });
  });

  context('Halaman Dashboard (setelah login)', () => {
    // Lakukan login sebelum setiap tes di konteks ini
    beforeEach(function() {
      const { email, password } = this.db.loginCredentials.valid;
      cy.get('[data-cy=input-login-email]').type(email);
      cy.get('[data-cy=input-login-password]').type(password);
      cy.get('[data-cy=button-login]').click();
      cy.wait('@loginRequest');
    });

    it('READ - seharusnya memuat dan menampilkan daftar user saat tombol diklik', function() {
      cy.get('[data-cy=button-fetch-users]').click();
      cy.wait('@getUsers');

      cy.get('[data-cy=user-list] li').should('have.length', this.db.users.length);
      cy.get('[data-cy=user-list] li').first().should('contain.text', 'George Bluth');
    });

    it('CREATE - seharusnya bisa membuat user baru melalui form', function() {
      const newUser = this.db.apiResponses.createUserPayload;
      cy.get('[data-cy=input-create-name]').type(newUser.name);
      cy.get('[data-cy=input-create-job]').type(newUser.job);
      cy.get('[data-cy=button-create]').click();

      cy.wait('@createUser');
      cy.get('[data-cy=message-dashboard]').should('be.visible').and('contain.text', 'berhasil dibuat');
    });

    it('DELETE - seharusnya bisa menghapus user dari daftar', function() {
      // Muat user terlebih dahulu
      cy.get('[data-cy=button-fetch-users]').click();
      cy.wait('@getUsers');

      // Hapus user pertama (ID 1)
      cy.get('[data-cy-user-id=1] .danger').click();
      cy.wait('@deleteUser');

      // Verifikasi bahwa user sudah tidak ada di list
      cy.get('[data-cy-user-id=1]').should('not.exist');
      cy.get('[data-cy=message-dashboard]').should('contain.text', 'berhasil dihapus');
    });
  });

});