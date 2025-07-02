describe('Data Driven Testing untuk Form Pegawai', () => {

  // Pertama, kita muat data dari fixture
  before(() => {
    cy.fixture('employees').as('employeeData');
  });

  it('seharusnya bisa mendaftarkan beberapa pegawai dari data fixture', function() {
    // Kita gunakan 'function()' agar bisa mengakses 'this.employeeData'

    // Loop melalui setiap objek pegawai di dalam data fixture
    this.employeeData.forEach((employee) => {
      
      cy.log(`--- Mendaftarkan: ${employee.name} ---`);

      // Kunjungi halaman form sebelum setiap pendaftaran
      cy.visit('/employee-form.html');

      // Isi form dengan data dari pegawai saat ini
      cy.get('[data-cy="input-nama"]').clear().type(employee.name);
      cy.get('[data-cy="input-jabatan"]').clear().type(employee.job);

      // Klik tombol submit
      cy.get('[data-cy="button-submit"]').click();

      // Verifikasi bahwa pesan sukses muncul dengan nama yang benar
      cy.get('[data-cy="message-success"]')
        .should('be.visible')
        .and('contain.text', `Pegawai "${employee.name}" berhasil didaftarkan!`);
    });
  });
});