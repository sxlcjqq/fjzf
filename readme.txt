1.����Ŀ�漰 node + express + mongodb + sass + markdown + vue + webpack ��ҳ���� + elementui
2.���ȣ�ʹ��vuejs����һ����webpack����Ŀ
 ������� vue init webpack fjzf
3.������Ŀ����װ����
��� npm install

��װaxios
npm install axios -S
��װelementui
npm install element-ui -S

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
1-git init                 # ���زֿ��ʼ����ִ�������ڹ���Ŀ¼������һ��.git������Ŀ¼

2-git add .               # ��������ļ������������������÷���git add <file>

3-git commit -m "My first commit operation"   # �ύ�޸ĵ����زֿ⣬-mѡ������ύע��

4-git remote add origin git@github.com:mayouchen123/learngit.git   # ���Զ�ֿ̲��ַ��������origin������


5-git push origin master      # ����ǰһ��������origin������github��ַ���͵�github�ֿ��master��֧