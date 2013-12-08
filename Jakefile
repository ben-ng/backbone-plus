var pkgname = require('./package.json').name
	, pub;

desc('Deploy this build');
pub = new jake.NpmPublishTask(pkgname, function () {
  this.packageFiles.include([
    'lib/**/'
  , 'package.json'
  , 'Jakefile'
  , 'Readme.md'
    ]);
  this.packageFiles.exclude([
  	'tests'
  ]);
});
