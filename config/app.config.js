var commonStorePath = 'http://172.104.61.150/I-task/'
module.exports = {
  gateway: {
    url: "http://localhost:5000"
  },
  otp: {
    expirySeconds: 2 * 60
  },
  users: {
    imageBase: commonStorePath + 'images/profile-images/',
    // imageUploadPath: '/var/www/html/I-task/images/profile-images/'
    imageUploadPath: 'uploads/'
  },
  members: {
    imageBase: commonStorePath + 'images/member-images/',
    // imageUploadPath: '/var/www/html/I-task/images/member-images/',
    imageUploadPath: 'uploads/',
    resultsPerPage: 30,
  },
  tasks: {
    fileBase: commonStorePath + 'files/task-documents/',
    // documentsUploadPath: '/var/www/html/I-task/files/task-documents/',
    idocumentsUploadPath: 'uploads/',
    resultsPerPage: 30,
  },
  projects: {
    fileBase: commonStorePath + 'files/project-documents/',
    // documentsUploadPath: '/var/www/html/I-task/files/project-documents/',
    documentsUploadPath: 'uploads/',
    resultsPerPage: 30,
  },
}
