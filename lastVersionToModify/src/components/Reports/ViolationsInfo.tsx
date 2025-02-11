import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, AlertCircle, Shield } from 'lucide-react';

const ViolationsInfo: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const getViolationsList = () => {
    switch (i18n.language) {
      case 'ar':
        return (
          <div className="text-right" dir="rtl">
            <h3 className="text-xl font-bold mb-4">قائمة الانتهاكات التي يمكن الإبلاغ عنها في وُلاضَّمْ</h3>
            <div className="space-y-6">
              <section>
                <h4 className="text-lg font-semibold mb-2">١. التحريض العنصري والتمييز القَبَلي</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>مقاطع فيديو أو تسجيلات صوتية تدعو إلى استهداف مناطق أو مجموعات على أساس عِرقي.</li>
                  <li>التحريض على قتل المواطنين أو تهجيرهم بسبب انتمائهم القَبَلي.</li>
                  <li>دعوات لمقاطعة أو عزل أفراد القبائل على أساس عرقي.</li>
                  <li>خطابات كراهية صادرة عن جهات رسمية أو شخصيات مؤثرة تحرض ضد قبائل البقَّارة والأبَّالة.</li>
                </ul>
              </section>

              <section>
                <h4 className="text-lg font-semibold mb-2">٢. الهجمات العسكرية والاستهداف القَبَلي</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>قصف جوي يستهدف قرى أو مناطق مدنية على أساس قبلي، مع توثيق التاريخ والموقع الدقيق.</li>
                  <li>استهداف المدنيين العُزَّل بالهجمات العسكرية، وعدد الضحايا وأسماؤهم إن أمكن.</li>
                  <li>تدمير الممتلكات الخاصة أو القرى بسبب الانتماء القبلي.</li>
                  <li>فرض حصار أو منع دخول المساعدات الإنسانية للمناطق المتضررة بسبب انتمائها القَبَلي.</li>
                </ul>
              </section>

              <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
                <p className="text-red-700">
                  ❌ نحن لا نعتبر قصف الطيران على المواقع العسكرية أو استهداف أي جهة عسكرية انتهاكًا.
                </p>
                <p className="mt-2 text-gray-600">
                  وُلاضَّمْ منظمة تُعنى بحماية المدنيين وليس لها علاقة بالحرب الدائرة بين الجيش والدعم السريع.
                </p>
              </div>

              <section>
                <h4 className="text-lg font-semibold mb-2">٣. انتهاكات الحقوق المدنية</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>رفض استخراج وثائق رسمية بسبب الانتماء القَبَلي.</li>
                  <li>اعتقالات تعسفية على أساس قبلي دون أي مسوغات قانونية.</li>
                  <li>التعذيب داخل السجون أو المعسكرات بسبب الهوية القَبَلية.</li>
                  <li>الفصل التعسفي من الوظائف أو حرمان الطلاب من الدراسة بسبب الانتماء القَبَلي.</li>
                </ul>
              </section>
            </div>
          </div>
        );
      case 'fr':
        return (
          <div>
            <h3 className="text-xl font-bold mb-4">Liste des Violations Acceptées par WULADAM</h3>
            <div className="space-y-6">
              <section>
                <h4 className="text-lg font-semibold mb-2">1. Incitation au Racisme et Discrimination Tribale</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Vidéos ou enregistrements audio appelant au ciblage de zones ou de groupes sur une base ethnique.</li>
                  <li>Appels au meurtre ou à l'expulsion de citoyens en raison de leur appartenance tribale.</li>
                  <li>Appels au boycott ou à l'isolement de membres de tribus sur une base ethnique.</li>
                  <li>Discours de haine de la part d'officiels ou de personnalités influentes contre les tribus Baggara et Abbala.</li>
                </ul>
              </section>

              <section>
                <h4 className="text-lg font-semibold mb-2">2. Attaques Militaires et Ciblage Tribal</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Bombardements aériens ciblant des villages ou zones civiles sur une base tribale, avec date et lieu documentés.</li>
                  <li>Ciblage de civils non armés, avec nombre de victimes et noms si possible.</li>
                  <li>Destruction de propriétés privées ou de villages en raison de l'appartenance tribale.</li>
                  <li>Blocus ou refus d'aide humanitaire aux zones affectées en raison de leur identité tribale.</li>
                </ul>
              </section>

              <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
                <p className="text-red-700">
                  ❌ Nous ne considérons pas les frappes aériennes sur des sites militaires ou le ciblage d'entités militaires comme des violations.
                </p>
                <p className="mt-2 text-gray-600">
                  WULADAM est une organisation de protection des civils et n'interfère pas dans la guerre en cours entre l'armée et les FSR.
                </p>
              </div>

              <section>
                <h4 className="text-lg font-semibold mb-2">3. Violations des Droits Civils</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Refus de délivrer des documents officiels en raison de l'appartenance tribale.</li>
                  <li>Arrestations arbitraires sur base tribale sans justification légale.</li>
                  <li>Torture dans les prisons ou camps en raison de l'identité tribale.</li>
                  <li>Licenciements arbitraires ou privation d'éducation en raison de l'appartenance tribale.</li>
                </ul>
              </section>
            </div>
          </div>
        );
      default: // English
        return (
          <div>
            <h3 className="text-xl font-bold mb-4">List of Violations Accepted by WULADAM</h3>
            <div className="space-y-6">
              <section>
                <h4 className="text-lg font-semibold mb-2">1. Racial Incitement and Tribal Discrimination</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Videos or audio recordings calling for targeting areas or groups based on ethnicity.</li>
                  <li>Incitement to kill or displace citizens due to their tribal affiliation.</li>
                  <li>Calls for boycott or isolation of tribal members based on ethnicity.</li>
                  <li>Hate speech from officials or influential figures against Baggara and Abbala tribes.</li>
                </ul>
              </section>

              <section>
                <h4 className="text-lg font-semibold mb-2">2. Military Attacks and Tribal Targeting</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Aerial bombings targeting villages or civilian areas based on tribal affiliation, with documented date and location.</li>
                  <li>Targeting of unarmed civilians, with number of victims and names if available.</li>
                  <li>Destruction of private property or villages due to tribal affiliation.</li>
                  <li>Blockade or denial of humanitarian aid to affected areas based on tribal identity.</li>
                </ul>
              </section>

              <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
                <p className="text-red-700">
                  ❌ We do not consider airstrikes on military sites or targeting of any military entity as violations.
                </p>
                <p className="mt-2 text-gray-600">
                  WULADAM is a civilian protection organization and does not interfere in the ongoing war between the army and RSF.
                </p>
              </div>

              <section>
                <h4 className="text-lg font-semibold mb-2">3. Civil Rights Violations</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Denial of official documents due to tribal affiliation.</li>
                  <li>Arbitrary arrests based on tribal identity without legal justification.</li>
                  <li>Torture in prisons or camps due to tribal identity.</li>
                  <li>Arbitrary dismissal from jobs or denial of education due to tribal affiliation.</li>
                </ul>
              </section>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200"
      >
        <div className="flex items-center">
          <Shield className="w-6 h-6 text-waladom-green mr-2" />
          <h2 className="text-lg font-semibold">
            {t('reports.acceptedViolations')}
          </h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="p-6">
          {getViolationsList()}
        </div>
      )}
    </div>
  );
};

export default ViolationsInfo;