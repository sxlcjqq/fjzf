1.����Ŀ�漰 node + express + mongodb + sass + markdown + vue + webpack ��ҳ���� + elementui
2.���ȣ�ʹ��vuejs����һ����webpack����Ŀ
 ������� vue init webpack fjzf
3.������Ŀ����װ����
��� npm install

��װaxios
npm install axios -S
��װelementui
npm install element-ui -S
npm install --save element-ui element-ui/lib/them-chalk/index.css
4.ʹ��express generator���������ɺ�˷�����
���express server -e //-eΪejsģ�壬��html��-jΪjadeģ��

    ��View �ļ�����index.ejs�Ƚϲ�ϰ�ߣ����Զ�app.js����С�Ķ���
��app.set('view engine', 'ejs');�� ��� ��app.engine('.html', ejs.__express);app.set('view engine', 'html');��
��һ�г��ֵ�ejs������Ҫrequire ejsģ�飬���Ӵ��롰var ejs = require('ejs');��
5.�������ɵ�serverĿ¼��ʹ��npm i ���װexpress������
6.����express��
cd ../ ����Ŀ��Ŀ¼
node server/bin/www  // ��������
7.����������� http://localhost:3000/#/ ���Ϳ��Կ���express����ҳ����
8.�������package������"server": "node ./server/bin/www"�������з���
***ʹ�� npm run dev �� npm run server ͬʱ����ǰ�˺ͷ����



github���ͱ��ع��̵�github�ֿ�
0-rm -fr .git  #ɾ�����زֿ�.git
1-git init                 # ���زֿ��ʼ����ִ�������ڹ���Ŀ¼������һ��.git������Ŀ¼

2-git add .               # ��������ļ������������������÷���git add <file>

3-git commit -m "My first commit operation"   # �ύ�޸ĵ����زֿ⣬-mѡ������ύע��

4-git remote add origin git@github.com:mayouchen123/learngit.git   # ���Զ�ֿ̲��ַ��������origin������


5-git push origin master      # ����ǰһ��������origin������github��ַ���͵�github�ֿ��master��֧



mongodb
1--����mongo����
���mongod
2--�ٿ�һ���նˣ�����mongodb������
���mongo
3--�鿴���п�
show dbs
4--�л���ĳ�⣨myList��
use myList
5--�鿴ĳ�ű�users��
db.users.find()
6--����users���в�������
db.users.insert({��name��:��jqq��,��password��:��111��})
7--�ӱ�users����ɾ������ ��justOne�����Ϊ true �� 1����ֻɾ��һ���ĵ�����
db.users.remove({'name':'jqq'},{justOne:1})
8--Ϊ��types�������������ֶ���Ϊtext��ֵΪ1Ϊָ�������򴴽�������������밴��������������ָ��Ϊ-1���ɣ�
db.types.ensureIndex({��text��:1},{unique:true})
9--�鿴��types������
db.types.getIndexes()
10--ɾ����types������
db.types.dropIndex({"text":1})
11--�ر�mongodb����
db.shutdownServer()
