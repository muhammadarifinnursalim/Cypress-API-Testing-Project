describe('Simulasi Lengkap: Login dan CRUD User dengan Fixture', () => {

  // Hook ini akan memuat seluruh 'database' kita sebelum setiap tes
  beforeEach(() => {
    cy.fixture('crud-db.json').as('db');
  });

  // ==================
  // === LOGIN TEST ===
  // ==================
  it('LOGIN - Seharusnya mengembalikan token untuk login yang valid', function() {
    // Simulasi: "Jika saya mengirim kredensial yang valid..."
    const credentials = this.db.loginCredentials.valid;
    cy.log('Mengirim kredensial:', credentials);
    
    // "...maka saya berharap menerima respons sukses"
    const expectedResponse = this.db.apiResponses.loginSuccess;
    
    expect(expectedResponse.statusCode).to.eq(200);
    expect(expectedResponse.body.token).to.exist;
  });

  it('LOGIN - Seharusnya mengembalikan error untuk login yang tidak valid', function() {
    // Simulasi: "Jika saya mengirim kredensial yang salah..."
    const credentials = this.db.loginCredentials.invalid;
    cy.log('Mengirim kredensial:', credentials);

    // "...maka saya berharap menerima respons error"
    const expectedResponse = this.db.apiResponses.loginFailure;
    
    expect(expectedResponse.statusCode).to.eq(400);
    expect(expectedResponse.body.error).to.eq('user not found');
  });

  // ==================
  // === CRUD TESTS ===
  // ==================
  it('CREATE - Seharusnya bisa membuat user baru', function() {
    // Simulasi: "Jika saya mengirim data user baru (payload)..."
    const payload = this.db.apiResponses.createUserPayload;
    cy.log('Payload untuk membuat user:', payload);

    // "...maka saya berharap menerima data user yang baru dibuat beserta ID dan createdAt"
    const expectedResponse = this.db.apiResponses.createUserSuccess;

    expect(expectedResponse.statusCode).to.eq(201);
    expect(expectedResponse.body.name).to.eq(payload.name); // Pastikan nama sesuai
    expect(expectedResponse.body).to.have.property('id');
  });

  it('READ - Seharusnya bisa membaca seluruh daftar user', function() {
    // Simulasi: "Saya ingin mengambil semua user dari database"
    const userList = this.db.users;
    cy.log('Daftar user dari DB:', userList);

    expect(userList).to.be.an('array');
    expect(userList).to.have.length(2); // Sesuai dengan data di fixture kita
    expect(userList[0].first_name).to.eq('George');
  });

  it('READ - Seharusnya bisa membaca satu user spesifik berdasarkan ID', function() {
    // Simulasi: "Cari user dengan ID=2 di database saya"
    const userIdToFind = 2;
    const user = this.db.users.find(u => u.id === userIdToFind);
    cy.log(`Hasil pencarian user ID ${userIdToFind}:`, user);
    
    expect(user).to.exist;
    expect(user.id).to.eq(userIdToFind);
    expect(user.email).to.eq('janet.weaver@reqres.in');
  });

  it('UPDATE - Seharusnya bisa memperbarui data user', function() {
    // Simulasi: "Jika saya mengirim data update (payload)..."
    const payload = this.db.apiResponses.updateUserPayload;
    cy.log('Payload untuk update user:', payload);

    // "...maka saya berharap menerima data yang sudah ter-update"
    const expectedResponse = this.db.apiResponses.updateUserSuccess;
    
    expect(expectedResponse.statusCode).to.eq(200);
    expect(expectedResponse.body.job).to.eq('Senior Accountant');
    expect(expectedResponse.body).to.have.property('updatedAt');
  });
  
  it('DELETE - Seharusnya bisa menghapus user dari daftar', function() {
    // Simulasi: "Hapus user dengan ID=1 dari daftar"
    const userIdToDelete = 1;
    cy.log(`Database sebelum delete: ${this.db.users.length} users`);
    
    // Gunakan filter untuk membuat daftar 'baru' seolah-olah user sudah dihapus
    const usersAfterDelete = this.db.users.filter(u => u.id !== userIdToDelete);
    cy.log(`Database setelah delete: ${usersAfterDelete.length} users`);

    // Verifikasi bahwa jumlah user berkurang satu
    expect(usersAfterDelete).to.have.length(this.db.users.length - 1);
    // Verifikasi bahwa user dengan ID 1 sudah tidak ada
    expect(usersAfterDelete.find(u => u.id === userIdToDelete)).to.be.undefined;
  });

});