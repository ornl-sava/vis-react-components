import React from 'react'

import { timeParse } from 'd3'

import SummaryTimelineChart from '../src/premade/SummaryTimelineChart'

let testData =
  [
    {
      'date': '2017-03-15T00:00:00Z',
      'avg': 0.4838268258884837,
      'innerRangeMin': -0.5997606958217658,
      'innerRangeMax': 1.5674143475987332,
      'outerRangeMin': -1.5997606958217658,
      'outerRangeMax': 2.914435740768514
    },
    {
      'date': '2017-03-16T00:00:00Z',
      'avg': 0.6498042770734018,
      'innerRangeMin': -0.3501957229265982,
      'innerRangeMax': 1.6498042770734018,
      'outerRangeMin': -1.3501957229265982,
      'outerRangeMax': 2.6767602566667934
    },
    {
      'date': '2017-03-17T00:00:00Z',
      'avg': 0.39657698918555845,
      'innerRangeMin': -0.6034230108144416,
      'innerRangeMax': 1.3965769891855584,
      'outerRangeMin': -1.6034230108144416,
      'outerRangeMax': 2.3965769891855584
    },
    {
      'date': '2017-03-18T00:00:00Z',
      'avg': 0.4849612531449654,
      'innerRangeMin': -0.5150387468550346,
      'innerRangeMax': 1.4849612531449654,
      'outerRangeMin': -1.5150387468550346,
      'outerRangeMax': 2.4849612531449656
    },
    {
      'date': '2017-03-19T00:00:00Z',
      'avg': 0.11182658882916507,
      'innerRangeMin': -0.9079548829321445,
      'innerRangeMax': 1.1316080605904748,
      'outerRangeMin': -1.9079548829321444,
      'outerRangeMax': 2.385872950793172
    },
    {
      'date': '2017-03-20T00:00:00Z',
      'avg': 0.32641800647039926,
      'innerRangeMin': -1.098725046911943,
      'innerRangeMax': 1.7515610598527414,
      'outerRangeMin': -2.1469731177308056,
      'outerRangeMax': 3.2567776094723846
    },
    {
      'date': '2017-03-21T00:00:00Z',
      'avg': 0.9240126606893876,
      'innerRangeMin': -0.5227299337827002,
      'innerRangeMax': 2.3707552551614754,
      'outerRangeMin': -1.894982525889982,
      'outerRangeMax': 4.34948747181687
    },
    {
      'date': '2017-03-22T00:00:00Z',
      'avg': 1.0200327765952553,
      'innerRangeMin': -0.8077773968970023,
      'innerRangeMax': 2.8478429500875126,
      'outerRangeMin': -2.307609211410443,
      'outerRangeMax': 4.702596253005742
    },
    {
      'date': '2017-03-23T00:00:00Z',
      'avg': 0.8348119271684077,
      'innerRangeMin': -0.9528672314865813,
      'innerRangeMax': 2.6224910858233965,
      'outerRangeMin': -2.2850449496385474,
      'outerRangeMax': 4.298814756535617
    },
    {
      'date': '2017-03-24T00:00:00Z',
      'avg': 0.7671452293915184,
      'innerRangeMin': -1.006478442838773,
      'innerRangeMax': 2.54076890162181,
      'outerRangeMin': -2.0211099840609426,
      'outerRangeMax': 4.115407358848046
    },
    {
      'date': '2017-03-25T00:00:00Z',
      'avg': 0.40400182328846734,
      'innerRangeMin': -1.1591314216665092,
      'innerRangeMax': 1.967135068243444,
      'outerRangeMin': -2.159131421666509,
      'outerRangeMax': 3.453974950309104
    },
    {
      'date': '2017-03-26T00:00:00Z',
      'avg': 0.17386726166395494,
      'innerRangeMin': -1.3104847455327724,
      'innerRangeMax': 1.6582192688606823,
      'outerRangeMin': -2.657724501405034,
      'outerRangeMax': 3.1854325525703007
    },
    {
      'date': '2017-03-27T00:00:00Z',
      'avg': 0.0917122150354922,
      'innerRangeMin': -1.3229848267439923,
      'innerRangeMax': 1.5064092568149765,
      'outerRangeMin': -2.6079551636112246,
      'outerRangeMax': 2.905703720458493
    },
    {
      'date': '2017-03-28T00:00:00Z',
      'avg': 0.49871246559473936,
      'innerRangeMin': -0.9320936189134058,
      'innerRangeMax': 1.9295185501028844,
      'outerRangeMin': -1.9916376752426674,
      'outerRangeMax': 3.769873807860148
    },
    {
      'date': '2017-03-29T00:00:00Z',
      'avg': 0.4318088362775557,
      'innerRangeMin': -0.8473781192320202,
      'innerRangeMax': 1.7109957917871315,
      'outerRangeMin': -2.270275031001572,
      'outerRangeMax': 3.844022191344159
    },
    {
      'date': '2017-03-30T00:00:00Z',
      'avg': 0.3230761199791241,
      'innerRangeMin': -1.1492528059846034,
      'innerRangeMax': 1.7954050459428517,
      'outerRangeMin': -2.149252805984603,
      'outerRangeMax': 3.95293052554774
    },
    {
      'date': '2017-03-31T00:00:00Z',
      'avg': 0,
      'innerRangeMin': -1.4189988863363066,
      'innerRangeMax': 1.4189988863363066,
      'outerRangeMin': -2.4330845207428187,
      'outerRangeMax': 3.540489159233389
    },
    {
      'date': '2017-04-01T00:00:00Z',
      'avg': 0,
      'innerRangeMin': -1.676727053012014,
      'innerRangeMax': 1.676727053012014,
      'outerRangeMin': -2.676727053012014,
      'outerRangeMax': 3.5762470662345414
    },
    {
      'date': '2017-04-02T00:00:00Z',
      'avg': 0.12708177212750002,
      'innerRangeMin': -1.64286952283292,
      'innerRangeMax': 1.8970330670879199,
      'outerRangeMin': -3.132657479854431,
      'outerRangeMax': 4.139095222677426
    },
    {
      'date': '2017-04-03T00:00:00Z',
      'avg': 0.4086472003630267,
      'innerRangeMin': -1.6494043714145885,
      'innerRangeMax': 2.466698772140642,
      'outerRangeMin': -3.16997771413609,
      'outerRangeMax': 4.649063149365183
    },
    {
      'date': '2017-04-04T00:00:00Z',
      'avg': 0.7256273960595032,
      'innerRangeMin': -1.6618464316178985,
      'innerRangeMax': 3.113101223736905,
      'outerRangeMin': -3.265794569712374,
      'outerRangeMax': 5.417851322464122
    },
    {
      'date': '2017-04-05T00:00:00Z',
      'avg': 0.42800384942499453,
      'innerRangeMin': -1.5330198333452636,
      'innerRangeMax': 2.3890275321952528,
      'outerRangeMin': -2.600159083793974,
      'outerRangeMax': 4.166204678963068
    },
    {
      'date': '2017-04-06T00:00:00Z',
      'avg': 0.016565567345759147,
      'innerRangeMin': -1.838682641109555,
      'innerRangeMax': 1.8718137758010733,
      'outerRangeMin': -2.838682641109555,
      'outerRangeMax': 3.717760864527443
    },
    {
      'date': '2017-04-07T00:00:00Z',
      'avg': 0,
      'innerRangeMin': -2.0590350716408548,
      'innerRangeMax': 2.0590350716408548,
      'outerRangeMin': -3.0590350716408548,
      'outerRangeMax': 3.8449994990774172
    },
    {
      'date': '2017-04-08T00:00:00Z',
      'avg': 0,
      'innerRangeMin': -2.4151598765166282,
      'innerRangeMax': 2.4151598765166282,
      'outerRangeMin': -3.735945959876594,
      'outerRangeMax': 4.133276455675999
    },
    {
      'date': '2017-04-09T00:00:00Z',
      'avg': 0,
      'innerRangeMin': -2.2148063471667485,
      'innerRangeMax': 2.2148063471667485,
      'outerRangeMin': -3.337507524051288,
      'outerRangeMax': 3.8542659453355927
    },
    {
      'date': '2017-04-10T00:00:00Z',
      'avg': 0.09294806171906941,
      'innerRangeMin': -2.4157885593090254,
      'innerRangeMax': 2.601684682747164,
      'outerRangeMin': -3.6223920977837096,
      'outerRangeMax': 3.9493023987830025
    },
    {
      'date': '2017-04-11T00:00:00Z',
      'avg': 0,
      'innerRangeMin': -2.2719973584053235,
      'innerRangeMax': 2.2719973584053235,
      'outerRangeMin': -3.3441606023211756,
      'outerRangeMax': 3.564330742207103
    },
    {
      'date': '2017-04-12T00:00:00Z',
      'avg': 0,
      'innerRangeMin': -2.252529204482935,
      'innerRangeMax': 2.252529204482935,
      'outerRangeMin': -3.252529204482935,
      'outerRangeMax': 3.2676858291305675
    },
    {
      'date': '2017-04-13T00:00:00Z',
      'avg': 0.1693023586981386,
      'innerRangeMin': -2.260962223393995,
      'innerRangeMax': 2.5995669407902717,
      'outerRangeMin': -3.4776447052469237,
      'outerRangeMax': 3.5995669407902717
    },
    {
      'date': '2017-04-14T00:00:00Z',
      'avg': 0,
      'innerRangeMin': -2.1636271610484337,
      'innerRangeMax': 2.1636271610484337,
      'outerRangeMin': -3.188995552370799,
      'outerRangeMax': 3.195414781039979
    },
    {
      'date': '2017-04-15T00:00:00Z',
      'avg': 0.576865491342553,
      'innerRangeMin': -1.7158974402235279,
      'innerRangeMax': 2.869628422908634,
      'outerRangeMin': -2.715897440223528,
      'outerRangeMax': 4.094480333764773
    },
    {
      'date': '2017-04-16T00:00:00Z',
      'avg': 0.5823912772375869,
      'innerRangeMin': -1.9715080773211273,
      'innerRangeMax': 3.1362906317963013,
      'outerRangeMin': -3.475017700047623,
      'outerRangeMax': 4.649179429229858
    },
    {
      'date': '2017-04-17T00:00:00Z',
      'avg': 0.5978859510729762,
      'innerRangeMin': -2.0206368996678568,
      'innerRangeMax': 3.216408801813809,
      'outerRangeMin': -3.614960865502887,
      'outerRangeMax': 4.998284597524529
    },
    {
      'date': '2017-04-18T00:00:00Z',
      'avg': 0.5854181158359744,
      'innerRangeMin': -1.7797524256215667,
      'innerRangeMax': 2.9505886572935154,
      'outerRangeMin': -3.2005722432008037,
      'outerRangeMax': 4.3754340613165255
    },
    {
      'date': '2017-04-19T00:00:00Z',
      'avg': 0.20211501611227345,
      'innerRangeMin': -2.2333611885064015,
      'innerRangeMax': 2.637591220730948,
      'outerRangeMin': -3.841926453309611,
      'outerRangeMax': 3.637591220730948
    },
    {
      'date': '2017-04-20T00:00:00Z',
      'avg': 0.17821389156572995,
      'innerRangeMin': -2.428079424086327,
      'innerRangeMax': 2.784507207217787,
      'outerRangeMin': -4.036146169942972,
      'outerRangeMax': 4.195483877874438
    },
    {
      'date': '2017-04-21T00:00:00Z',
      'avg': 0.3635670201250158,
      'innerRangeMin': -2.6562418475384284,
      'innerRangeMax': 3.3833758877884597,
      'outerRangeMin': -4.391278224904189,
      'outerRangeMax': 4.92055104128942
    },
    {
      'date': '2017-04-22T00:00:00Z',
      'avg': 0.29442392957250973,
      'innerRangeMin': -2.7805186805718805,
      'innerRangeMax': 3.3693665397169,
      'outerRangeMin': -4.505511059825671,
      'outerRangeMax': 4.806224107250799
    },
    {
      'date': '2017-04-23T00:00:00Z',
      'avg': 0,
      'innerRangeMin': -3.340454828795782,
      'innerRangeMax': 3.340454828795782,
      'outerRangeMin': -4.873541468463752,
      'outerRangeMax': 4.960288043251868
    },
    {
      'date': '2017-04-24T00:00:00Z',
      'avg': 0.02664840202436078,
      'innerRangeMin': -3.426056435946949,
      'innerRangeMax': 3.4793532399956706,
      'outerRangeMin': -4.653082626799996,
      'outerRangeMax': 5.219790713549678
    },
    {
      'date': '2017-04-25T00:00:00Z',
      'avg': 0,
      'innerRangeMin': -3.449147689876857,
      'innerRangeMax': 3.449147689876857,
      'outerRangeMin': -4.635200983858156,
      'outerRangeMax': 4.917358483816472
    },
    {
      'date': '2017-04-26T00:00:00Z',
      'avg': 0,
      'innerRangeMin': -3.08730528452427,
      'innerRangeMax': 3.08730528452427,
      'outerRangeMin': -4.244356443372335,
      'outerRangeMax': 4.19417498429706
    },
    {
      'date': '2017-04-27T00:00:00Z',
      'avg': 0.32583637564318624,
      'innerRangeMin': -2.6918993413449885,
      'innerRangeMax': 3.343572092631361,
      'outerRangeMin': -3.7314818086396544,
      'outerRangeMax': 4.572841673549303
    },
    {
      'date': '2017-04-28T00:00:00Z',
      'avg': 0.8198594455520269,
      'innerRangeMin': -2.399046860746439,
      'innerRangeMax': 4.038765751850493,
      'outerRangeMin': -3.5745502037170147,
      'outerRangeMax': 5.408776851726928
    },
    {
      'date': '2017-04-29T00:00:00Z',
      'avg': 1.1988986155826384,
      'innerRangeMin': -1.968738802642251,
      'innerRangeMax': 4.366536033807527,
      'outerRangeMin': -3.080248362447207,
      'outerRangeMax': 5.540460077940441
    },
    {
      'date': '2017-04-30T00:00:00Z',
      'avg': 1.403578080076341,
      'innerRangeMin': -1.6361242678940928,
      'innerRangeMax': 4.443280428046775,
      'outerRangeMin': -2.636124267894093,
      'outerRangeMax': 5.443280428046775
    },
    {
      'date': '2017-05-01T00:00:00Z',
      'avg': 1.1999202430966731,
      'innerRangeMin': -1.6676827961250664,
      'innerRangeMax': 4.067523282318413,
      'outerRangeMin': -2.7491165554252377,
      'outerRangeMax': 5.067523282318413
    },
    {
      'date': '2017-05-02T00:00:00Z',
      'avg': 0.9573677170455719,
      'innerRangeMin': -1.832294117758713,
      'innerRangeMax': 3.747029551849857,
      'outerRangeMin': -3.1650134862267514,
      'outerRangeMax': 4.883605522250896
    },
    {
      'date': '2017-05-03T00:00:00Z',
      'avg': 0.7332494364700413,
      'innerRangeMin': -2.4080121165613853,
      'innerRangeMax': 3.8745109895014678,
      'outerRangeMin': -4.134851007399232,
      'outerRangeMax': 5.009781932287155
    },
    {
      'date': '2017-05-04T00:00:00Z',
      'avg': 0.6201769796574137,
      'innerRangeMin': -2.7346077253813554,
      'innerRangeMax': 3.974961684696183,
      'outerRangeMin': -4.871669943736713,
      'outerRangeMax': 5.487674020786746
    },
    {
      'date': '2017-05-05T00:00:00Z',
      'avg': 0.6007353517430823,
      'innerRangeMin': -2.9174532040055485,
      'innerRangeMax': 4.118923907491713,
      'outerRangeMin': -5.402110727821339,
      'outerRangeMax': 5.760672368780546
    },
    {
      'date': '2017-05-06T00:00:00Z',
      'avg': 0.5027732511168488,
      'innerRangeMin': -3.290078213911592,
      'innerRangeMax': 4.295624716145289,
      'outerRangeMin': -5.840829774138467,
      'outerRangeMax': 6.014378112078224
    },
    {
      'date': '2017-05-07T00:00:00Z',
      'avg': 0.5206213460607539,
      'innerRangeMin': -3.2507358720848556,
      'innerRangeMax': 4.291978564206364,
      'outerRangeMin': -5.744057252674006,
      'outerRangeMax': 5.899219430808036
    },
    {
      'date': '2017-05-08T00:00:00Z',
      'avg': 0.16109295808789137,
      'innerRangeMin': -3.1025745498984527,
      'innerRangeMax': 3.4247604660742352,
      'outerRangeMin': -5.41011057975103,
      'outerRangeMax': 4.744197319541361
    },
    {
      'date': '2017-05-09T00:00:00Z',
      'avg': 0.2554670440735337,
      'innerRangeMin': -3.347519206187306,
      'innerRangeMax': 3.8584532943343732,
      'outerRangeMin': -5.969991996270014,
      'outerRangeMax': 5.2120876183829274
    },
    {
      'date': '2017-05-10T00:00:00Z',
      'avg': 0.6390668929970486,
      'innerRangeMin': -2.9107240799122094,
      'innerRangeMax': 4.188857865906306,
      'outerRangeMin': -6.039581692465777,
      'outerRangeMax': 5.790753182657252
    },
    {
      'date': '2017-05-11T00:00:00Z',
      'avg': 0.6745186377982512,
      'innerRangeMin': -2.8054658095633074,
      'innerRangeMax': 4.15450308515981,
      'outerRangeMin': -5.822376240246636,
      'outerRangeMax': 6.270467204605404
    },
    {
      'date': '2017-05-12T00:00:00Z',
      'avg': 0.5478665355545195,
      'innerRangeMin': -2.5876043563397975,
      'innerRangeMax': 3.683337427448836,
      'outerRangeMin': -5.22278447857795,
      'outerRangeMax': 5.717013894440271
    },
    {
      'date': '2017-05-13T00:00:00Z',
      'avg': 0.25520345230319424,
      'innerRangeMin': -2.594246689083851,
      'innerRangeMax': 3.1046535936902395,
      'outerRangeMin': -4.811442958299736,
      'outerRangeMax': 5.185112777565305
    },
    {
      'date': '2017-05-14T00:00:00Z',
      'avg': 0.4491664004554109,
      'innerRangeMin': -2.01300602143817,
      'innerRangeMax': 2.911338822348992,
      'outerRangeMin': -4.2036732592212305,
      'outerRangeMax': 4.609873103457115
    },
    {
      'date': '2017-05-15T00:00:00Z',
      'avg': 0.7338915899070692,
      'innerRangeMin': -1.8862573356673322,
      'innerRangeMax': 3.3540405154814708,
      'outerRangeMin': -3.874416955088101,
      'outerRangeMax': 5.278554950797574
    },
    {
      'date': '2017-05-16T00:00:00Z',
      'avg': 0.7836780530051541,
      'innerRangeMin': -1.819047533018046,
      'innerRangeMax': 3.3864036390283543,
      'outerRangeMin': -3.837606992825693,
      'outerRangeMax': 5.6204626513033675
    },
    {
      'date': '2017-05-17T00:00:00Z',
      'avg': 0.8250995890634436,
      'innerRangeMin': -2.029826523707717,
      'innerRangeMax': 3.6800257018346043,
      'outerRangeMin': -4.575394183216619,
      'outerRangeMax': 6.390604824317112
    },
    {
      'date': '2017-05-18T00:00:00Z',
      'avg': 0.8909667154852831,
      'innerRangeMin': -2.2599233175580378,
      'innerRangeMax': 4.041856748528604,
      'outerRangeMin': -4.839277895129625,
      'outerRangeMax': 6.841826772224229
    },
    {
      'date': '2017-05-19T00:00:00Z',
      'avg': 0.8683884155226357,
      'innerRangeMin': -2.1406990356969704,
      'innerRangeMax': 3.877475866742242,
      'outerRangeMin': -4.702006883242526,
      'outerRangeMax': 6.503501258806157
    },
    {
      'date': '2017-05-20T00:00:00Z',
      'avg': 0.9712508104401386,
      'innerRangeMin': -2.1065664395954484,
      'innerRangeMax': 4.049068060475726,
      'outerRangeMin': -4.565152366162334,
      'outerRangeMax': 6.859651661447019
    },
    {
      'date': '2017-05-21T00:00:00Z',
      'avg': 1.2127308439401339,
      'innerRangeMin': -1.6375736173273836,
      'innerRangeMax': 4.063035305207651,
      'outerRangeMin': -4.065525204785263,
      'outerRangeMax': 6.774620277673959
    },
    {
      'date': '2017-05-22T00:00:00Z',
      'avg': 0.9564312013392551,
      'innerRangeMin': -2.317007070700142,
      'innerRangeMax': 4.229869473378652,
      'outerRangeMin': -4.794545826094979,
      'outerRangeMax': 7.411385033105219
    },
    {
      'date': '2017-05-23T00:00:00Z',
      'avg': 1.4793497159812254,
      'innerRangeMin': -2.2974773051917254,
      'innerRangeMax': 5.256176737154176,
      'outerRangeMin': -4.842271306916274,
      'outerRangeMax': 9.008344580677411
    },
    {
      'date': '2017-05-24T00:00:00Z',
      'avg': 1.174178974076042,
      'innerRangeMin': -2.8832080093004273,
      'innerRangeMax': 5.231565957452512,
      'outerRangeMin': -5.290035439905408,
      'outerRangeMax': 8.688825589192593
    },
    {
      'date': '2017-05-25T00:00:00Z',
      'avg': 1.3683934834560196,
      'innerRangeMin': -2.856757392133705,
      'innerRangeMax': 5.593544359045744,
      'outerRangeMin': -4.918587606527899,
      'outerRangeMax': 8.921786211562493
    },
    {
      'date': '2017-05-26T00:00:00Z',
      'avg': 1.2035856674090784,
      'innerRangeMin': -2.5051584586714464,
      'innerRangeMax': 4.912329793489603,
      'outerRangeMin': -4.432589510207924,
      'outerRangeMax': 8.313288151947544
    },
    {
      'date': '2017-05-27T00:00:00Z',
      'avg': 1.3808092526859939,
      'innerRangeMin': -2.0334723943939865,
      'innerRangeMax': 4.795090899765975,
      'outerRangeMin': -4.2075942308346965,
      'outerRangeMax': 8.22703686232359
    },
    {
      'date': '2017-05-28T00:00:00Z',
      'avg': 1.0856195793051784,
      'innerRangeMin': -2.393007452935811,
      'innerRangeMax': 4.564246611546167,
      'outerRangeMin': -4.591532331494842,
      'outerRangeMax': 8.056668861242018
    },
    {
      'date': '2017-05-29T00:00:00Z',
      'avg': 1.4480572895949646,
      'innerRangeMin': -2.2969631857664687,
      'innerRangeMax': 5.1930777649563975,
      'outerRangeMin': -4.927254959230196,
      'outerRangeMax': 9.166471293349854
    },
    {
      'date': '2017-05-30T00:00:00Z',
      'avg': 1.5206116653059132,
      'innerRangeMin': -2.348017990865464,
      'innerRangeMax': 5.38924132147729,
      'outerRangeMin': -4.958442922958437,
      'outerRangeMax': 9.138674845038057
    },
    {
      'date': '2017-05-31T00:00:00Z',
      'avg': 1.7550032402231903,
      'innerRangeMin': -2.3603854915466895,
      'innerRangeMax': 5.87039197199307,
      'outerRangeMin': -4.921962385561619,
      'outerRangeMax': 9.365706477979222
    },
    {
      'date': '2017-06-01T00:00:00Z',
      'avg': 1.7873530290969402,
      'innerRangeMin': -2.523123250943243,
      'innerRangeMax': 6.097829309137124,
      'outerRangeMin': -4.87644453813942,
      'outerRangeMax': 9.78755814491721
    },
    {
      'date': '2017-06-02T00:00:00Z',
      'avg': 2.014043863570921,
      'innerRangeMin': -2.0219851295143996,
      'innerRangeMax': 6.050072856656241,
      'outerRangeMin': -4.482573584391549,
      'outerRangeMax': 9.336977616451438
    },
    {
      'date': '2017-06-03T00:00:00Z',
      'avg': 2.2416024053452874,
      'innerRangeMin': -1.5138661695004458,
      'innerRangeMax': 5.997070980191021,
      'outerRangeMin': -3.819558699548903,
      'outerRangeMax': 9.671342823956012
    },
    {
      'date': '2017-06-04T00:00:00Z',
      'avg': 2.6161447191145655,
      'innerRangeMin': -1.0308971743408817,
      'innerRangeMax': 6.263186612570013,
      'outerRangeMin': -3.6874495635419136,
      'outerRangeMax': 9.818560141540281
    },
    {
      'date': '2017-06-05T00:00:00Z',
      'avg': 3.1043186077531164,
      'innerRangeMin': -1.0805034290533966,
      'innerRangeMax': 7.289140644559629,
      'outerRangeMin': -4.029313218007031,
      'outerRangeMax': 10.914083788877084
    },
    {
      'date': '2017-06-06T00:00:00Z',
      'avg': 3.1550965195333713,
      'innerRangeMin': -1.3032502255368952,
      'innerRangeMax': 7.613443264603638,
      'outerRangeMin': -3.9576799669836347,
      'outerRangeMax': 10.897751290316801
    },
    {
      'date': '2017-06-07T00:00:00Z',
      'avg': 2.870856584338107,
      'innerRangeMin': -1.0520554202873011,
      'innerRangeMax': 6.793768588963515,
      'outerRangeMin': -3.6367183238809773,
      'outerRangeMax': 10.02446721651252
    },
    {
      'date': '2017-06-08T00:00:00Z',
      'avg': 2.695839736963829,
      'innerRangeMin': -0.6643572012010104,
      'innerRangeMax': 6.056036675128668,
      'outerRangeMin': -3.3942180345064634,
      'outerRangeMax': 9.238554313355701
    },
    {
      'date': '2017-06-09T00:00:00Z',
      'avg': 3.012740802481462,
      'innerRangeMin': -0.4130830892098136,
      'innerRangeMax': 6.438564694172738,
      'outerRangeMin': -3.2380993043323403,
      'outerRangeMax': 9.235187375717341
    },
    {
      'date': '2017-06-10T00:00:00Z',
      'avg': 3.532224663150717,
      'innerRangeMin': -0.3427737259255008,
      'innerRangeMax': 7.407223052226934,
      'outerRangeMin': -3.0391677064982727,
      'outerRangeMax': 10.008760077737374
    },
    {
      'date': '2017-06-11T00:00:00Z',
      'avg': 3.5670424804801844,
      'innerRangeMin': -0.223973228452234,
      'innerRangeMax': 7.358058189412603,
      'outerRangeMin': -3.4166873921831535,
      'outerRangeMax': 10.471773178645225
    },
    {
      'date': '2017-06-12T00:00:00Z',
      'avg': 3.310346377344512,
      'innerRangeMin': -0.8920054352817548,
      'innerRangeMax': 7.512698189970779,
      'outerRangeMin': -4.134237370291524,
      'outerRangeMax': 10.843438527609294
    },
    {
      'date': '2017-06-13T00:00:00Z',
      'avg': 3.117109569481656,
      'innerRangeMin': -1.2755131793750816,
      'innerRangeMax': 7.5097323183383935,
      'outerRangeMin': -4.210592475887152,
      'outerRangeMax': 10.84570478312425
    },
    {
      'date': '2017-06-14T00:00:00Z',
      'avg': 2.9739009368435547,
      'innerRangeMin': -0.8656456064789908,
      'innerRangeMax': 6.813447480166101,
      'outerRangeMin': -3.629681900626331,
      'outerRangeMax': 10.27277283985521
    },
    {
      'date': '2017-06-15T00:00:00Z',
      'avg': 2.5964724771625867,
      'innerRangeMin': -1.0285364994856088,
      'innerRangeMax': 6.221481453810782,
      'outerRangeMin': -4.0558562621129415,
      'outerRangeMax': 9.300883503110056
    },
    {
      'date': '2017-06-16T00:00:00Z',
      'avg': 2.549768304588961,
      'innerRangeMin': -1.021724003994442,
      'innerRangeMax': 6.121260613172364,
      'outerRangeMin': -4.35881291347639,
      'outerRangeMax': 9.277446036671797
    },
    {
      'date': '2017-06-17T00:00:00Z',
      'avg': 2.6308850981251966,
      'innerRangeMin': -1.239420485828064,
      'innerRangeMax': 6.501190682078457,
      'outerRangeMin': -5.016419543355498,
      'outerRangeMax': 9.841926472441687
    },
    {
      'date': '2017-06-18T00:00:00Z',
      'avg': 2.9630675134831423,
      'innerRangeMin': -1.2820485002705015,
      'innerRangeMax': 7.208183527236786,
      'outerRangeMin': -5.464198136124756,
      'outerRangeMax': 10.897910671926118
    },
    {
      'date': '2017-06-19T00:00:00Z',
      'avg': 3.0196751305232183,
      'innerRangeMin': -1.3222171759095032,
      'innerRangeMax': 7.36156743695594,
      'outerRangeMin': -5.799053410770357,
      'outerRangeMax': 10.781402877885329
    },
    {
      'date': '2017-06-20T00:00:00Z',
      'avg': 2.5931960858935463,
      'innerRangeMin': -1.32232068959269,
      'innerRangeMax': 6.508712861379783,
      'outerRangeMin': -5.783937014163744,
      'outerRangeMax': 9.740671602861918
    },
    {
      'date': '2017-06-21T00:00:00Z',
      'avg': 2.1421665769609213,
      'innerRangeMin': -1.7481987957981269,
      'innerRangeMax': 6.032531949719969,
      'outerRangeMin': -5.835891832831166,
      'outerRangeMax': 9.146893430909842
    },
    {
      'date': '2017-06-22T00:00:00Z',
      'avg': 1.8534112423791211,
      'innerRangeMin': -1.7188065858573411,
      'innerRangeMax': 5.425629070615583,
      'outerRangeMin': -6.077444747614495,
      'outerRangeMax': 8.287847707331046
    },
    {
      'date': '2017-06-23T00:00:00Z',
      'avg': 1.7372870512592815,
      'innerRangeMin': -2.233599093672638,
      'innerRangeMax': 5.708173196191201,
      'outerRangeMin': -7.179553360870287,
      'outerRangeMax': 8.525805055994294
    },
    {
      'date': '2017-06-24T00:00:00Z',
      'avg': 1.7674398993108358,
      'innerRangeMin': -2.227343760923654,
      'innerRangeMax': 5.762223559545325,
      'outerRangeMin': -7.227343760923654,
      'outerRangeMax': 8.739067488336113
    },
    {
      'date': '2017-06-25T00:00:00Z',
      'avg': 1.8508498006267173,
      'innerRangeMin': -2.3163316074357496,
      'innerRangeMax': 6.018031208689184,
      'outerRangeMin': -7.31633160743575,
      'outerRangeMax': 8.815003962820148
    },
    {
      'date': '2017-06-26T00:00:00Z',
      'avg': 1.526058176383215,
      'innerRangeMin': -2.2204661409188975,
      'innerRangeMax': 5.272582493685327,
      'outerRangeMin': -7.047735040648822,
      'outerRangeMax': 7.893114629179088
    },
    {
      'date': '2017-06-27T00:00:00Z',
      'avg': 1.1636420350195076,
      'innerRangeMin': -2.7724662644372304,
      'innerRangeMax': 5.099750334476246,
      'outerRangeMin': -7.722772180858927,
      'outerRangeMax': 7.748255953468442
    },
    {
      'date': '2017-06-28T00:00:00Z',
      'avg': 1.1851723094872368,
      'innerRangeMin': -2.3584278127210707,
      'innerRangeMax': 4.728772431695544,
      'outerRangeMin': -7.063541976821067,
      'outerRangeMax': 7.062512876569392
    },
    {
      'date': '2017-06-29T00:00:00Z',
      'avg': 1.6239568025580653,
      'innerRangeMin': -1.973245691235259,
      'innerRangeMax': 5.22115929635139,
      'outerRangeMin': -6.797870936914794,
      'outerRangeMax': 7.355979440335798
    },
    {
      'date': '2017-06-30T00:00:00Z',
      'avg': 1.8345959088298063,
      'innerRangeMin': -2.219906922387218,
      'innerRangeMax': 5.889098740046831,
      'outerRangeMin': -7.180427560535276,
      'outerRangeMax': 8.467228576770184
    },
    {
      'date': '2017-07-01T00:00:00Z',
      'avg': 2.047532610618538,
      'innerRangeMin': -1.7334220786083847,
      'innerRangeMax': 5.82848729984546,
      'outerRangeMin': -6.733422078608385,
      'outerRangeMax': 8.6797971326468
    },
    {
      'date': '2017-07-02T00:00:00Z',
      'avg': 2.001643120407667,
      'innerRangeMin': -1.868171025202289,
      'innerRangeMax': 5.871457266017623,
      'outerRangeMin': -6.8681710252022885,
      'outerRangeMax': 8.208443681554096
    },
    {
      'date': '2017-07-03T00:00:00Z',
      'avg': 1.9204758937614803,
      'innerRangeMin': -1.6516962494579077,
      'innerRangeMax': 5.492648036980868,
      'outerRangeMin': -6.1976807363959425,
      'outerRangeMax': 7.932205774538309
    },
    {
      'date': '2017-07-04T00:00:00Z',
      'avg': 1.5666091250024028,
      'innerRangeMin': -2.1784851076975595,
      'innerRangeMax': 5.311703357702365,
      'outerRangeMin': -6.49681940285557,
      'outerRangeMax': 8.012206911192036
    },
    {
      'date': '2017-07-05T00:00:00Z',
      'avg': 1.4326453166286193,
      'innerRangeMin': -2.194040044523986,
      'innerRangeMax': 5.059330677781224,
      'outerRangeMin': -6.501341157494414,
      'outerRangeMax': 8.217394745395817
    },
    {
      'date': '2017-07-06T00:00:00Z',
      'avg': 1.7013166054689641,
      'innerRangeMin': -2.4025436010803416,
      'innerRangeMax': 5.80517681201827,
      'outerRangeMin': -6.90108265513638,
      'outerRangeMax': 9.385093083908078
    },
    {
      'date': '2017-07-07T00:00:00Z',
      'avg': 2.1213756932403944,
      'innerRangeMin': -2.0206831207221834,
      'innerRangeMax': 6.263434507202972,
      'outerRangeMin': -6.650618945217242,
      'outerRangeMax': 9.736440157958818
    },
    {
      'date': '2017-07-08T00:00:00Z',
      'avg': 2.2182162194553383,
      'innerRangeMin': -1.8957073754560163,
      'innerRangeMax': 6.332139814366693,
      'outerRangeMin': -6.287285754649766,
      'outerRangeMax': 9.40292789187009
    },
    {
      'date': '2017-07-09T00:00:00Z',
      'avg': 2.348468947456843,
      'innerRangeMin': -1.907545677865028,
      'innerRangeMax': 6.604483572778714,
      'outerRangeMin': -5.863837448381687,
      'outerRangeMax': 9.47925094282865
    },
    {
      'date': '2017-07-10T00:00:00Z',
      'avg': 2.3941790968531054,
      'innerRangeMin': -1.3828274351253582,
      'innerRangeMax': 6.171185628831569,
      'outerRangeMin': -4.832336748884597,
      'outerRangeMax': 9.133586833682756
    },
    {
      'date': '2017-07-11T00:00:00Z',
      'avg': 2.2219153404211047,
      'innerRangeMin': -1.662898239867729,
      'innerRangeMax': 6.106728920709939,
      'outerRangeMin': -5.163587115121936,
      'outerRangeMax': 9.121250220351415
    },
    {
      'date': '2017-07-12T00:00:00Z',
      'avg': 2.193340703795364,
      'innerRangeMin': -1.9884361091329548,
      'innerRangeMax': 6.375117516723682,
      'outerRangeMin': -5.340566410213367,
      'outerRangeMax': 9.625539150292163
    },
    {
      'date': '2017-07-13T00:00:00Z',
      'avg': 2.0610673525351997,
      'innerRangeMin': -2.4900296202625194,
      'innerRangeMax': 6.612164325332919,
      'outerRangeMin': -5.87958157201402,
      'outerRangeMax': 9.654552643966708
    },
    {
      'date': '2017-07-14T00:00:00Z',
      'avg': 1.7029833784998953,
      'innerRangeMin': -3.107087119093344,
      'innerRangeMax': 6.513053876093134,
      'outerRangeMin': -6.695198269951362,
      'outerRangeMax': 9.21269290161944
    },
    {
      'date': '2017-07-15T00:00:00Z',
      'avg': 1.400878249600964,
      'innerRangeMin': -2.8967044916736877,
      'innerRangeMax': 5.698460990875615,
      'outerRangeMin': -6.195607782189125,
      'outerRangeMax': 8.124067723968704
    },
    {
      'date': '2017-07-16T00:00:00Z',
      'avg': 1.166319143073064,
      'innerRangeMin': -3.039626065018852,
      'innerRangeMax': 5.37226435116498,
      'outerRangeMin': -5.8851860259254245,
      'outerRangeMax': 7.345719912965001
    },
    {
      'date': '2017-07-17T00:00:00Z',
      'avg': 1.4403063835271634,
      'innerRangeMin': -3.1021919111050433,
      'innerRangeMax': 5.98280467815937,
      'outerRangeMin': -6.342546508064615,
      'outerRangeMax': 7.717426386959826
    },
    {
      'date': '2017-07-18T00:00:00Z',
      'avg': 1.535547739574283,
      'innerRangeMin': -3.5711720272124428,
      'innerRangeMax': 6.642267506361009,
      'outerRangeMin': -7.327667569402077,
      'outerRangeMax': 8.928578571212118
    },
    {
      'date': '2017-07-19T00:00:00Z',
      'avg': 2.0758554155459845,
      'innerRangeMin': -2.9426456082541574,
      'innerRangeMax': 7.094356439346127,
      'outerRangeMin': -6.675307556735371,
      'outerRangeMax': 9.315234287789133
    },
    {
      'date': '2017-07-20T00:00:00Z',
      'avg': 1.7654335201200144,
      'innerRangeMin': -3.3165921304233796,
      'innerRangeMax': 6.8474591706634085,
      'outerRangeMin': -7.103155093523556,
      'outerRangeMax': 8.979559931022777
    },
    {
      'date': '2017-07-21T00:00:00Z',
      'avg': 1.9432687054353888,
      'innerRangeMin': -2.7256178253091514,
      'innerRangeMax': 6.612155236179929,
      'outerRangeMin': -6.35357380491531,
      'outerRangeMax': 8.604301040837944
    },
    {
      'date': '2017-07-22T00:00:00Z',
      'avg': 1.7819990007000337,
      'innerRangeMin': -2.709249835384229,
      'innerRangeMax': 6.2732478367842965,
      'outerRangeMin': -5.83493336067207,
      'outerRangeMax': 7.729243491027303
    },
    {
      'date': '2017-07-23T00:00:00Z',
      'avg': 1.7965451580524374,
      'innerRangeMin': -2.53448752289295,
      'innerRangeMax': 6.127577838997825,
      'outerRangeMin': -5.252395793449821,
      'outerRangeMax': 7.524940672877578
    },
    {
      'date': '2017-07-24T00:00:00Z',
      'avg': 2.1425334662067317,
      'innerRangeMin': -2.3588084775915648,
      'innerRangeMax': 6.643875410005029,
      'outerRangeMin': -5.025739853914078,
      'outerRangeMax': 7.862552097694653
    },
    {
      'date': '2017-07-25T00:00:00Z',
      'avg': 2.410676926245048,
      'innerRangeMin': -2.3335845930892822,
      'innerRangeMax': 7.154938445579377,
      'outerRangeMin': -5.585912680271626,
      'outerRangeMax': 8.745138524273
    },
    {
      'date': '2017-07-26T00:00:00Z',
      'avg': 2.77141087202212,
      'innerRangeMin': -1.75387126697388,
      'innerRangeMax': 7.296693011018121,
      'outerRangeMin': -4.833096166042372,
      'outerRangeMax': 8.666982381508177
    },
    {
      'date': '2017-07-27T00:00:00Z',
      'avg': 2.8260802333994173,
      'innerRangeMin': -1.6747908659031303,
      'innerRangeMax': 7.326951332701965,
      'outerRangeMin': -4.9590453078125005,
      'outerRangeMax': 8.326951332701965
    },
    {
      'date': '2017-07-28T00:00:00Z',
      'avg': 2.431745354060217,
      'innerRangeMin': -1.7352388823689822,
      'innerRangeMax': 6.598729590489416,
      'outerRangeMin': -5.1401936737577305,
      'outerRangeMax': 7.598729590489416
    },
    {
      'date': '2017-07-29T00:00:00Z',
      'avg': 2.4446980778953002,
      'innerRangeMin': -1.4563996648288722,
      'innerRangeMax': 6.345795820619473,
      'outerRangeMin': -4.454015817089895,
      'outerRangeMax': 7.345795820619473
    },
    {
      'date': '2017-07-30T00:00:00Z',
      'avg': 2.604350087423088,
      'innerRangeMin': -1.0155660130351567,
      'innerRangeMax': 6.224266187881333,
      'outerRangeMin': -3.9906743512819767,
      'outerRangeMax': 7.570557739957774
    },
    {
      'date': '2017-07-31T00:00:00Z',
      'avg': 2.4445186371833714,
      'innerRangeMin': -1.0350147172502928,
      'innerRangeMax': 5.924051991617036,
      'outerRangeMin': -3.9153119460843917,
      'outerRangeMax': 7.078648147116196
    },
    {
      'date': '2017-08-01T00:00:00Z',
      'avg': 2.6463900679798957,
      'innerRangeMin': -0.6711981793038353,
      'innerRangeMax': 5.963978315263627,
      'outerRangeMin': -4.056572361181454,
      'outerRangeMax': 7.518172904847573
    },
    {
      'date': '2017-08-02T00:00:00Z',
      'avg': 2.640253559259615,
      'innerRangeMin': -0.44126998014052665,
      'innerRangeMax': 5.721777098659757,
      'outerRangeMin': -3.457715554225224,
      'outerRangeMax': 6.9850322485078005
    },
    {
      'date': '2017-08-03T00:00:00Z',
      'avg': 2.7833756039540627,
      'innerRangeMin': 0.21803017750014853,
      'innerRangeMax': 5.348721030407977,
      'outerRangeMin': -2.4899381507661213,
      'outerRangeMax': 6.540360729529201
    },
    {
      'date': '2017-08-04T00:00:00Z',
      'avg': 2.8834073838086587,
      'innerRangeMin': 0.4998484600563686,
      'innerRangeMax': 5.266966307560949,
      'outerRangeMin': -2.1875019305550256,
      'outerRangeMax': 6.576318867252884
    },
    {
      'date': '2017-08-05T00:00:00Z',
      'avg': 3.0634369950539377,
      'innerRangeMin': 0.5552547936566299,
      'innerRangeMax': 5.571619196451246,
      'outerRangeMin': -2.0839605533460555,
      'outerRangeMax': 6.971861960063329
    },
    {
      'date': '2017-08-06T00:00:00Z',
      'avg': 3.364890634039131,
      'innerRangeMin': 0.2932973342016849,
      'innerRangeMax': 6.436483933876577,
      'outerRangeMin': -2.1968364872183725,
      'outerRangeMax': 8.193474256256643
    },
    {
      'date': '2017-08-07T00:00:00Z',
      'avg': 3.2976833557079277,
      'innerRangeMin': -0.036483115489224005,
      'innerRangeMax': 6.631849826905079,
      'outerRangeMin': -2.3642646431747907,
      'outerRangeMax': 8.417281947877411
    },
    {
      'date': '2017-08-08T00:00:00Z',
      'avg': 3.3425058755941417,
      'innerRangeMin': 0.042106424173216084,
      'innerRangeMax': 6.642905327015067,
      'outerRangeMin': -2.0505741950145353,
      'outerRangeMax': 8.086001841160051
    },
    {
      'date': '2017-08-09T00:00:00Z',
      'avg': 3.2459220818312398,
      'innerRangeMin': -0.2526068293427679,
      'innerRangeMax': 6.744450993005247,
      'outerRangeMin': -2.466537288446041,
      'outerRangeMax': 8.040883678319181
    },
    {
      'date': '2017-08-10T00:00:00Z',
      'avg': 3.2495951281515114,
      'innerRangeMin': -0.09143689581144177,
      'innerRangeMax': 6.590627152114465,
      'outerRangeMin': -2.0186244158668147,
      'outerRangeMax': 7.590627152114465
    },
    {
      'date': '2017-08-11T00:00:00Z',
      'avg': 3.260017411117845,
      'innerRangeMin': 0.3035394926902981,
      'innerRangeMax': 6.216495329545392,
      'outerRangeMin': -2.0096335194361297,
      'outerRangeMax': 7.408604170852732
    },
    {
      'date': '2017-08-12T00:00:00Z',
      'avg': 3.5925528354215155,
      'innerRangeMin': 0.5676697656181586,
      'innerRangeMax': 6.617435905224872,
      'outerRangeMin': -1.9584607485829113,
      'outerRangeMax': 8.125580987407389
    },
    {
      'date': '2017-08-13T00:00:00Z',
      'avg': 3.9265662613418306,
      'innerRangeMin': 0.7543667792699549,
      'innerRangeMax': 7.098765743413706,
      'outerRangeMin': -1.902716846497118,
      'outerRangeMax': 8.675071062792961
    },
    {
      'date': '2017-08-14T00:00:00Z',
      'avg': 4.018098572325048,
      'innerRangeMin': 1.2020929597008667,
      'innerRangeMax': 6.834104184949229,
      'outerRangeMin': -1.7255447710408767,
      'outerRangeMax': 8.453885682298962
    },
    {
      'date': '2017-08-15T00:00:00Z',
      'avg': 4.176471054862574,
      'innerRangeMin': 1.32906806992363,
      'innerRangeMax': 7.023874039801519,
      'outerRangeMin': -1.3508885052007158,
      'outerRangeMax': 8.104080989791736
    },
    {
      'date': '2017-08-16T00:00:00Z',
      'avg': 3.9682615898483395,
      'innerRangeMin': 1.1378230530866529,
      'innerRangeMax': 6.798700126610026,
      'outerRangeMin': -1.426490909821661,
      'outerRangeMax': 7.816923045880824
    },
    {
      'date': '2017-08-17T00:00:00Z',
      'avg': 4.004484654194235,
      'innerRangeMin': 1.3662154214085036,
      'innerRangeMax': 6.642753886979968,
      'outerRangeMin': -0.9992555189399015,
      'outerRangeMax': 7.642753886979968
    },
    {
      'date': '2017-08-18T00:00:00Z',
      'avg': 3.811889920848435,
      'innerRangeMin': 1.3697629489873093,
      'innerRangeMax': 6.254016892709561,
      'outerRangeMin': -0.9006604192372731,
      'outerRangeMax': 7.48401123683415
    },
    {
      'date': '2017-08-19T00:00:00Z',
      'avg': 4.082566687407461,
      'innerRangeMin': 1.3621452723944012,
      'innerRangeMax': 6.80298810242052,
      'outerRangeMin': -0.8961520016919953,
      'outerRangeMax': 8.475204276152363
    },
    {
      'date': '2017-08-20T00:00:00Z',
      'avg': 3.930192414331526,
      'innerRangeMin': 0.9764648998277936,
      'innerRangeMax': 6.883919928835258,
      'outerRangeMin': -1.0045671869806938,
      'outerRangeMax': 8.431858395309748
    },
    {
      'date': '2017-08-21T00:00:00Z',
      'avg': 3.5758860616125383,
      'innerRangeMin': 1.0393512428135403,
      'innerRangeMax': 6.112420880411536,
      'outerRangeMin': -1.1812234136505264,
      'outerRangeMax': 7.278474143612882
    },
    {
      'date': '2017-08-22T00:00:00Z',
      'avg': 3.401246137943074,
      'innerRangeMin': 1.3732338971237943,
      'innerRangeMax': 5.429258378762354,
      'outerRangeMin': -0.4409036072135799,
      'outerRangeMax': 6.782591116439445
    },
    {
      'date': '2017-08-23T00:00:00Z',
      'avg': 3.516547501377276,
      'innerRangeMin': 1.7591029113447465,
      'innerRangeMax': 5.273992091409805,
      'outerRangeMin': -0.05032672071267674,
      'outerRangeMax': 6.415032672875054
    },
    {
      'date': '2017-08-24T00:00:00Z',
      'avg': 3.3435837935322095,
      'innerRangeMin': 1.302816633185759,
      'innerRangeMax': 5.38435095387866,
      'outerRangeMin': -0.2891754143303482,
      'outerRangeMax': 6.9929643357381766
    },
    {
      'date': '2017-08-25T00:00:00Z',
      'avg': 3.5934209004934776,
      'innerRangeMin': 1.152509528006921,
      'innerRangeMax': 6.034332272980034,
      'outerRangeMin': -0.65249998784076,
      'outerRangeMax': 7.724070731794917
    },
    {
      'date': '2017-08-26T00:00:00Z',
      'avg': 4.086141014038152,
      'innerRangeMin': 1.8128945486871637,
      'innerRangeMax': 6.359387479389142,
      'outerRangeMin': -0.30210090234446163,
      'outerRangeMax': 8.45868439393261
    },
    {
      'date': '2017-08-27T00:00:00Z',
      'avg': 3.7006326816866357,
      'innerRangeMin': 1.7942471859578337,
      'innerRangeMax': 5.607018177415438,
      'outerRangeMin': -0.2584359474840461,
      'outerRangeMax': 7.936462644896142
    },
    {
      'date': '2017-08-28T00:00:00Z',
      'avg': 3.419060731518242,
      'innerRangeMin': 1.619599881721101,
      'innerRangeMax': 5.2185215813153825,
      'outerRangeMin': -0.11914652241582946,
      'outerRangeMax': 6.969531162488808
    },
    {
      'date': '2017-08-29T00:00:00Z',
      'avg': 3.552147887648796,
      'innerRangeMin': 1.693168413943384,
      'innerRangeMax': 5.4111273613542075,
      'outerRangeMin': -0.004763049768693239,
      'outerRangeMax': 6.66284130008324
    },
    {
      'date': '2017-08-30T00:00:00Z',
      'avg': 3.677484632187954,
      'innerRangeMin': 2.0062734275881824,
      'innerRangeMax': 5.348695836787726,
      'outerRangeMin': 0.3537962305238014,
      'outerRangeMax': 6.57382959422765
    },
    {
      'date': '2017-08-31T00:00:00Z',
      'avg': 3.9854571372455294,
      'innerRangeMin': 1.9240127894893266,
      'innerRangeMax': 6.046901485001732,
      'outerRangeMin': 0.365976900610848,
      'outerRangeMax': 7.332422908735763
    },
    {
      'date': '2017-09-01T00:00:00Z',
      'avg': 3.832330005200701,
      'innerRangeMin': 1.556682714833463,
      'innerRangeMax': 6.107977295567939,
      'outerRangeMin': -0.27228077136333173,
      'outerRangeMax': 7.557859342563927
    },
    {
      'date': '2017-09-02T00:00:00Z',
      'avg': 3.6991709429791912,
      'innerRangeMin': 1.4744373837788802,
      'innerRangeMax': 5.923904502179502,
      'outerRangeMin': -0.37202318180400185,
      'outerRangeMax': 7.575582746639137
    },
    {
      'date': '2017-09-03T00:00:00Z',
      'avg': 3.7011484251520677,
      'innerRangeMin': 1.3719194304550246,
      'innerRangeMax': 6.030377419849111,
      'outerRangeMin': -0.13318006454675535,
      'outerRangeMax': 7.613085664784039
    },
    {
      'date': '2017-09-04T00:00:00Z',
      'avg': 3.320406710698268,
      'innerRangeMin': 0.9315857262250629,
      'innerRangeMax': 5.709227695171473,
      'outerRangeMin': -0.23532202179683837,
      'outerRangeMax': 6.9464315996994666
    },
    {
      'date': '2017-09-05T00:00:00Z',
      'avg': 3.0648302416697173,
      'innerRangeMin': 0.9701946969839019,
      'innerRangeMax': 5.159465786355533,
      'outerRangeMin': -0.10480140403119709,
      'outerRangeMax': 6.159465786355533
    },
    {
      'date': '2017-09-06T00:00:00Z',
      'avg': 3.4904245402569862,
      'innerRangeMin': 0.9824142829654532,
      'innerRangeMax': 5.998434797548519,
      'outerRangeMin': -0.01758571703454681,
      'outerRangeMax': 6.998434797548519
    },
    {
      'date': '2017-09-07T00:00:00Z',
      'avg': 3.8704271142158286,
      'innerRangeMin': 1.4187511938004191,
      'innerRangeMax': 6.322103034631239,
      'outerRangeMin': -0.16662099582814616,
      'outerRangeMax': 7.696741004383215
    },
    {
      'date': '2017-09-08T00:00:00Z',
      'avg': 4.062633834577685,
      'innerRangeMin': 1.2519947722097697,
      'innerRangeMax': 6.8732728969456005,
      'outerRangeMin': -0.46538653523015583,
      'outerRangeMax': 8.36955260829209
    },
    {
      'date': '2017-09-09T00:00:00Z',
      'avg': 4.051163916669004,
      'innerRangeMin': 1.397110586805825,
      'innerRangeMax': 6.705217246532182,
      'outerRangeMin': 0.017130660356561744,
      'outerRangeMax': 8.300781846431633
    },
    {
      'date': '2017-09-10T00:00:00Z',
      'avg': 3.4740952789556965,
      'innerRangeMin': 1.35401142242669,
      'innerRangeMax': 5.594179135484703,
      'outerRangeMin': 0.04749651665416277,
      'outerRangeMax': 7.155073712520634
    },
    {
      'date': '2017-09-11T00:00:00Z',
      'avg': 3.350210854905258,
      'innerRangeMin': 1.0408752275218567,
      'innerRangeMax': 5.659546482288659,
      'outerRangeMin': 0.04087522752185668,
      'outerRangeMax': 6.736595148658138
    },
    {
      'date': '2017-09-12T00:00:00Z',
      'avg': 3.2160400039925725,
      'innerRangeMin': 0.7776718583985036,
      'innerRangeMax': 5.654408149586642,
      'outerRangeMin': -0.4302531170601871,
      'outerRangeMax': 7.171694151588889
    },
    {
      'date': '2017-09-13T00:00:00Z',
      'avg': 3.1691674062149064,
      'innerRangeMin': 0.7653028405469611,
      'innerRangeMax': 5.573031971882852,
      'outerRangeMin': -0.28480220726749184,
      'outerRangeMax': 7.410737062666718
    },
    {
      'date': '2017-09-14T00:00:00Z',
      'avg': 3.36076478207794,
      'innerRangeMin': 0.9852501653167094,
      'innerRangeMax': 5.73627939883917,
      'outerRangeMin': -0.014749834683290608,
      'outerRangeMax': 7.379717809229994
    },
    {
      'date': '2017-09-15T00:00:00Z',
      'avg': 3.295119144493374,
      'innerRangeMin': 1.0178727715215135,
      'innerRangeMax': 5.572365517465235,
      'outerRangeMin': 0.017872771521513453,
      'outerRangeMax': 6.919773020988977
    },
    {
      'date': '2017-09-16T00:00:00Z',
      'avg': 3.1383718134168714,
      'innerRangeMin': 1.4444811303616665,
      'innerRangeMax': 4.832262496472076,
      'outerRangeMin': 0.4242976465537902,
      'outerRangeMax': 5.832262496472076
    },
    {
      'date': '2017-09-17T00:00:00Z',
      'avg': 3.1049210254864166,
      'innerRangeMin': 1.2590628527871246,
      'innerRangeMax': 4.9507791981857086,
      'outerRangeMin': 0.2590628527871246,
      'outerRangeMax': 6.145804481662589
    },
    {
      'date': '2017-09-18T00:00:00Z',
      'avg': 3.138778209886582,
      'innerRangeMin': 0.8700243117771733,
      'innerRangeMax': 5.407532107995991,
      'outerRangeMin': -0.12997568822282668,
      'outerRangeMax': 6.839217157248568
    },
    {
      'date': '2017-09-19T00:00:00Z',
      'avg': 3.3270553144643027,
      'innerRangeMin': 0.8205553679952731,
      'innerRangeMax': 5.833555260933332,
      'outerRangeMin': -0.3851556255069035,
      'outerRangeMax': 7.849208593566214
    },
    {
      'date': '2017-09-20T00:00:00Z',
      'avg': 3.6153424900674516,
      'innerRangeMin': 0.8982166532511489,
      'innerRangeMax': 6.332468326883754,
      'outerRangeMin': -0.22104864128284296,
      'outerRangeMax': 8.199096247231696
    },
    {
      'date': '2017-09-21T00:00:00Z',
      'avg': 3.41148531045308,
      'innerRangeMin': 0.640090962743999,
      'innerRangeMax': 6.182879658162161,
      'outerRangeMin': -0.359909037256001,
      'outerRangeMax': 8.408958151381075
    },
    {
      'date': '2017-09-22T00:00:00Z',
      'avg': 3.6237640665210678,
      'innerRangeMin': 0.9693323934510598,
      'innerRangeMax': 6.278195739591076,
      'outerRangeMin': -0.030667606548940185,
      'outerRangeMax': 7.9710058619321735
    },
    {
      'date': '2017-09-23T00:00:00Z',
      'avg': 3.6045834566960275,
      'innerRangeMin': 1.2221893088333173,
      'innerRangeMax': 5.986977604558738,
      'outerRangeMin': 0.22218930883331733,
      'outerRangeMax': 7.148004453247438
    },
    {
      'date': '2017-09-24T00:00:00Z',
      'avg': 3.258680437862075,
      'innerRangeMin': 0.7415691241258431,
      'innerRangeMax': 5.775791751598307,
      'outerRangeMin': -0.4877624207343636,
      'outerRangeMax': 7.29809986270971
    },
    {
      'date': '2017-09-25T00:00:00Z',
      'avg': 3.6226230202150544,
      'innerRangeMin': 1.323955218716359,
      'innerRangeMax': 5.92129082171375,
      'outerRangeMin': -0.30811099512728846,
      'outerRangeMax': 7.923294455116331
    },
    {
      'date': '2017-09-26T00:00:00Z',
      'avg': 4.14457956997611,
      'innerRangeMin': 1.910978584200306,
      'innerRangeMax': 6.378180555751914,
      'outerRangeMin': 0.44277690335922326,
      'outerRangeMax': 8.92476792883627
    },
    {
      'date': '2017-09-27T00:00:00Z',
      'avg': 4.023593433535856,
      'innerRangeMin': 1.4151887957095988,
      'innerRangeMax': 6.631998071362114,
      'outerRangeMin': 0.22580503744600033,
      'outerRangeMax': 9.127092497241142
    },
    {
      'date': '2017-09-28T00:00:00Z',
      'avg': 3.5506232506450273,
      'innerRangeMin': 0.8615610954278226,
      'innerRangeMax': 6.239685405862232,
      'outerRangeMin': -0.13843890457217745,
      'outerRangeMax': 8.539304154159609
    },
    {
      'date': '2017-09-29T00:00:00Z',
      'avg': 3.0751720575361197,
      'innerRangeMin': 0.3120188097676224,
      'innerRangeMax': 5.8383253053046165,
      'outerRangeMin': -0.6879811902323776,
      'outerRangeMax': 7.991065307633087
    },
    {
      'date': '2017-09-30T00:00:00Z',
      'avg': 3.137206278263364,
      'innerRangeMin': 0.7197422672604432,
      'innerRangeMax': 5.5546702892662845,
      'outerRangeMin': -0.2802577327395568,
      'outerRangeMax': 7.3241244680669695
    },
    {
      'date': '2017-10-01T00:00:00Z',
      'avg': 3.2701401437572746,
      'innerRangeMin': 0.9332775669910376,
      'innerRangeMax': 5.607002720523512,
      'outerRangeMin': -0.06672243300896241,
      'outerRangeMax': 7.480588122420505
    },
    {
      'date': '2017-10-02T00:00:00Z',
      'avg': 3.593239004858335,
      'innerRangeMin': 1.337450904814427,
      'innerRangeMax': 5.849027104902243,
      'outerRangeMin': 0.2986536444321002,
      'outerRangeMax': 8.199088977356254
    },
    {
      'date': '2017-10-03T00:00:00Z',
      'avg': 3.6659285723423136,
      'innerRangeMin': 1.4788363002503346,
      'innerRangeMax': 5.853020844434292,
      'outerRangeMin': 0.28918886310318914,
      'outerRangeMax': 8.292921945798609
    },
    {
      'date': '2017-10-04T00:00:00Z',
      'avg': 3.1935184925518105,
      'innerRangeMin': 1.2780165494048958,
      'innerRangeMax': 5.109020435698725,
      'outerRangeMin': 0.27801654940489584,
      'outerRangeMax': 7.504619274792488
    },
    {
      'date': '2017-10-05T00:00:00Z',
      'avg': 3.1128023039860757,
      'innerRangeMin': 1.4791197469553232,
      'innerRangeMax': 4.746484861016828,
      'outerRangeMin': 0.4791197469553232,
      'outerRangeMax': 7.2863826601898385
    },
    {
      'date': '2017-10-06T00:00:00Z',
      'avg': 3.320397557048188,
      'innerRangeMin': 1.4291057092072401,
      'innerRangeMax': 5.211689404889135,
      'outerRangeMin': 0.4291057092072401,
      'outerRangeMax': 7.465831819242181
    },
    {
      'date': '2017-10-07T00:00:00Z',
      'avg': 3.4799239653208356,
      'innerRangeMin': 1.3150186835628292,
      'innerRangeMax': 5.644829247078842,
      'outerRangeMin': 0.31501868356282925,
      'outerRangeMax': 7.951816990587619
    },
    {
      'date': '2017-10-08T00:00:00Z',
      'avg': 3.744471424818599,
      'innerRangeMin': 1.0169154047241884,
      'innerRangeMax': 6.472027444913009,
      'outerRangeMin': -0.5536824361213417,
      'outerRangeMax': 8.580440428957663
    },
    {
      'date': '2017-10-09T00:00:00Z',
      'avg': 3.9171679463785507,
      'innerRangeMin': 1.3574190992435757,
      'innerRangeMax': 6.476916793513526,
      'outerRangeMin': 0.04650833039870239,
      'outerRangeMax': 8.873593126480749
    },
    {
      'date': '2017-10-10T00:00:00Z',
      'avg': 3.7352893475616575,
      'innerRangeMin': 1.1458428049842269,
      'innerRangeMax': 6.324735890139088,
      'outerRangeMin': 0.14584280498422686,
      'outerRangeMax': 9.052043606714303
    },
    {
      'date': '2017-10-11T00:00:00Z',
      'avg': 3.26389995314871,
      'innerRangeMin': 0.8255670211898622,
      'innerRangeMax': 5.702232885107557,
      'outerRangeMin': -0.28887545329127406,
      'outerRangeMax': 8.09734457462941
    },
    {
      'date': '2017-10-12T00:00:00Z',
      'avg': 2.8308684832902657,
      'innerRangeMin': 0.9378496313043521,
      'innerRangeMax': 4.72388733527618,
      'outerRangeMin': -0.4240900767603013,
      'outerRangeMax': 7.01372281870586
    },
    {
      'date': '2017-10-13T00:00:00Z',
      'avg': 3.2036508322428743,
      'innerRangeMin': 1.6134872135390737,
      'innerRangeMax': 4.793814450946675,
      'outerRangeMin': 0.2675162965682185,
      'outerRangeMax': 7.134847848467232
    },
    {
      'date': '2017-10-14T00:00:00Z',
      'avg': 2.9906335771304713,
      'innerRangeMin': 1.2957401447759636,
      'innerRangeMax': 4.685527009484979,
      'outerRangeMin': -0.19078241978992994,
      'outerRangeMax': 7.524415381118872
    },
    {
      'date': '2017-10-15T00:00:00Z',
      'avg': 2.9740701702898336,
      'innerRangeMin': 1.0836751125719242,
      'innerRangeMax': 4.864465228007743,
      'outerRangeMin': -0.5442312054358243,
      'outerRangeMax': 7.517783469864827
    },
    {
      'date': '2017-10-16T00:00:00Z',
      'avg': 2.601722441763033,
      'innerRangeMin': 0.4645715418283807,
      'innerRangeMax': 4.738873341697685,
      'outerRangeMin': -0.9999703147650316,
      'outerRangeMax': 7.506476182307426
    },
    {
      'date': '2017-10-17T00:00:00Z',
      'avg': 2.6336008724887527,
      'innerRangeMin': 0.5772803199982555,
      'innerRangeMax': 4.68992142497925,
      'outerRangeMin': -0.7906036252982895,
      'outerRangeMax': 7.53829838357396
    },
    {
      'date': '2017-10-18T00:00:00Z',
      'avg': 2.793378456420788,
      'innerRangeMin': 1.115415280475931,
      'innerRangeMax': 4.471341632365645,
      'outerRangeMin': -0.4454001612398075,
      'outerRangeMax': 7.497185594210538
    },
    {
      'date': '2017-10-19T00:00:00Z',
      'avg': 2.5263192138851425,
      'innerRangeMin': 0.7400005565434087,
      'innerRangeMax': 4.312637871226876,
      'outerRangeMin': -0.7768044533916973,
      'outerRangeMax': 7.684296660573872
    },
    {
      'date': '2017-10-20T00:00:00Z',
      'avg': 2.8216055324742926,
      'innerRangeMin': 1.0256883806501373,
      'innerRangeMax': 4.617522684298448,
      'outerRangeMin': -0.5389441327587003,
      'outerRangeMax': 8.15932347617682
    },
    {
      'date': '2017-10-21T00:00:00Z',
      'avg': 3.32158029317047,
      'innerRangeMin': 1.5129048908764162,
      'innerRangeMax': 5.130255695464524,
      'outerRangeMin': 0.15257736532324007,
      'outerRangeMax': 9.130255695464523
    },
    {
      'date': '2017-10-22T00:00:00Z',
      'avg': 3.5290706805558094,
      'innerRangeMin': 1.3802731422468129,
      'innerRangeMax': 5.6778682188648055,
      'outerRangeMin': 0.11869457984414078,
      'outerRangeMax': 9.677868218864806
    },
    {
      'date': '2017-10-23T00:00:00Z',
      'avg': 3.47147914039992,
      'innerRangeMin': 1.7874048048564566,
      'innerRangeMax': 5.155553475943384,
      'outerRangeMin': 0.7874048048564566,
      'outerRangeMax': 9.155553475943384
    },
    {
      'date': '2017-10-24T00:00:00Z',
      'avg': 3.3399850665817445,
      'innerRangeMin': 1.4676444122064427,
      'innerRangeMax': 5.212325720957047,
      'outerRangeMin': 0.3511817571285367,
      'outerRangeMax': 8.996386589892433
    },
    {
      'date': '2017-10-25T00:00:00Z',
      'avg': 3.34776096883534,
      'innerRangeMin': 1.2735920576603057,
      'innerRangeMax': 5.421929880010374,
      'outerRangeMin': 0.19522680154094263,
      'outerRangeMax': 9.421929880010374
    },
    {
      'date': '2017-10-26T00:00:00Z',
      'avg': 3.3703783468662682,
      'innerRangeMin': 0.8952226222303503,
      'innerRangeMax': 5.845534071502186,
      'outerRangeMin': -0.4202335541771014,
      'outerRangeMax': 9.845534071502186
    },
    {
      'date': '2017-10-27T00:00:00Z',
      'avg': 3.835774037788693,
      'innerRangeMin': 1.081161914237577,
      'innerRangeMax': 6.590386161339809,
      'outerRangeMin': -0.524059800238996,
      'outerRangeMax': 10.590386161339808
    },
    {
      'date': '2017-10-28T00:00:00Z',
      'avg': 4.297887136800509,
      'innerRangeMin': 1.198171983260893,
      'innerRangeMax': 7.397602290340124,
      'outerRangeMin': -0.367985061997522,
      'outerRangeMax': 11.397602290340124
    },
    {
      'date': '2017-10-29T00:00:00Z',
      'avg': 4.1649467473222055,
      'innerRangeMin': 1.462140669364043,
      'innerRangeMax': 6.867752825280368,
      'outerRangeMin': -0.17047660376296347,
      'outerRangeMax': 10.867752825280368
    },
    {
      'date': '2017-10-30T00:00:00Z',
      'avg': 4.022017575995317,
      'innerRangeMin': 1.4658619197473843,
      'innerRangeMax': 6.57817323224325,
      'outerRangeMin': 0.13622825117251836,
      'outerRangeMax': 10.462148966530672
    },
    {
      'date': '2017-10-31T00:00:00Z',
      'avg': 4.277843591224333,
      'innerRangeMin': 1.9146360372101903,
      'innerRangeMax': 6.641051145238476,
      'outerRangeMin': 0.8544116545774292,
      'outerRangeMax': 10.59082732054443
    },
    {
      'date': '2017-11-01T00:00:00Z',
      'avg': 4.33693808479315,
      'innerRangeMin': 2.160211122375398,
      'innerRangeMax': 6.513665047210902,
      'outerRangeMin': 1.1602111223753981,
      'outerRangeMax': 10.446318137951565
    },
    {
      'date': '2017-11-02T00:00:00Z',
      'avg': 4.737522881114138,
      'innerRangeMin': 1.9968292229563436,
      'innerRangeMax': 7.4782165392719335,
      'outerRangeMin': 0.4944142981207058,
      'outerRangeMax': 11.478216539271934
    },
    {
      'date': '2017-11-03T00:00:00Z',
      'avg': 4.947902141383779,
      'innerRangeMin': 2.050132497486374,
      'innerRangeMax': 7.845671785281185,
      'outerRangeMin': 0.5532291211482268,
      'outerRangeMax': 11.845671785281185
    },
    {
      'date': '2017-11-04T00:00:00Z',
      'avg': 5.151916282687417,
      'innerRangeMin': 2.3504276084697353,
      'innerRangeMax': 7.9534049569051,
      'outerRangeMin': 1.1330913118017274,
      'outerRangeMax': 11.9534049569051
    },
    {
      'date': '2017-11-05T00:00:00Z',
      'avg': 4.637352542175653,
      'innerRangeMin': 2.336298002944869,
      'innerRangeMax': 6.938407081406437,
      'outerRangeMin': 1.1457969812307796,
      'outerRangeMax': 10.938407081406437
    },
    {
      'date': '2017-11-06T00:00:00Z',
      'avg': 4.7507483411189515,
      'innerRangeMin': 2.5827964319708356,
      'innerRangeMax': 6.918700250267067,
      'outerRangeMin': 1.3196647790534803,
      'outerRangeMax': 10.918700250267067
    },
    {
      'date': '2017-11-07T00:00:00Z',
      'avg': 5.0927212661809,
      'innerRangeMin': 2.790442022699516,
      'innerRangeMax': 7.3950005096622835,
      'outerRangeMin': 1.4764501656436284,
      'outerRangeMax': 11.024130617252485
    },
    {
      'date': '2017-11-08T00:00:00Z',
      'avg': 5.096018539827696,
      'innerRangeMin': 2.6069884816211717,
      'innerRangeMax': 7.585048598034221,
      'outerRangeMin': 0.8266091695985862,
      'outerRangeMax': 11.19421383565149
    },
    {
      'date': '2017-11-09T00:00:00Z',
      'avg': 5.169929017008655,
      'innerRangeMin': 2.283422095451456,
      'innerRangeMax': 8.056435938565853,
      'outerRangeMin': 0.09108963415195959,
      'outerRangeMax': 12.056435938565853
    },
    {
      'date': '2017-11-10T00:00:00Z',
      'avg': 5.345568514798316,
      'innerRangeMin': 2.3888905808209437,
      'innerRangeMax': 8.302246448775689,
      'outerRangeMin': 0.1389920132861966,
      'outerRangeMax': 12.302246448775689
    },
    {
      'date': '2017-11-11T00:00:00Z',
      'avg': 4.862716520246207,
      'innerRangeMin': 2.026255761435014,
      'innerRangeMax': 7.6991772790574,
      'outerRangeMin': -0.41869485672108997,
      'outerRangeMax': 11.6991772790574
    },
    {
      'date': '2017-11-12T00:00:00Z',
      'avg': 4.64495201740927,
      'innerRangeMin': 1.8007054604655868,
      'innerRangeMax': 7.4891985743529546,
      'outerRangeMin': -0.263115527526125,
      'outerRangeMax': 11.489198574352955
    },
    {
      'date': '2017-11-13T00:00:00Z',
      'avg': 4.449166268442504,
      'innerRangeMin': 1.3983520968552088,
      'innerRangeMax': 7.499980440029798,
      'outerRangeMin': -0.745458807538689,
      'outerRangeMax': 11.499980440029798
    },
    {
      'date': '2017-11-14T00:00:00Z',
      'avg': 4.2625520920937205,
      'innerRangeMin': 1.029987705052497,
      'innerRangeMax': 7.4951164791349445,
      'outerRangeMin': -1.3798797089835952,
      'outerRangeMax': 11.495116479134944
    },
    {
      'date': '2017-11-15T00:00:00Z',
      'avg': 4.252042392622678,
      'innerRangeMin': 0.5871569905595297,
      'innerRangeMax': 7.916927794685826,
      'outerRangeMin': -2.197396765442283,
      'outerRangeMax': 11.916927794685826
    },
    {
      'date': '2017-11-16T00:00:00Z',
      'avg': 4.345319938117999,
      'innerRangeMin': 0.7434529207201348,
      'innerRangeMax': 7.947186955515864,
      'outerRangeMin': -2.2988459852294896,
      'outerRangeMax': 11.932806908141012
    },
    {
      'date': '2017-11-17T00:00:00Z',
      'avg': 4.561986199928459,
      'innerRangeMin': 1.4134306177496292,
      'innerRangeMax': 7.710541782107288,
      'outerRangeMin': -1.7774087682604542,
      'outerRangeMax': 11.710541782107288
    },
    {
      'date': '2017-11-18T00:00:00Z',
      'avg': 4.576781465710111,
      'innerRangeMin': 1.5547783397439576,
      'innerRangeMax': 7.598784591676264,
      'outerRangeMin': -1.312502910461553,
      'outerRangeMax': 11.33750966890101
    },
    {
      'date': '2017-11-19T00:00:00Z',
      'avg': 4.455130510093322,
      'innerRangeMin': 1.2663760028876894,
      'innerRangeMax': 7.643885017298954,
      'outerRangeMin': -1.3381772728445593,
      'outerRangeMax': 11.217259104713044
    },
    {
      'date': '2017-11-20T00:00:00Z',
      'avg': 4.29619629453133,
      'innerRangeMin': 1.0956140259626221,
      'innerRangeMax': 7.4967785631000385,
      'outerRangeMin': -1.8020278394117426,
      'outerRangeMax': 10.811187178618233
    },
    {
      'date': '2017-11-21T00:00:00Z',
      'avg': 4.438531170382666,
      'innerRangeMin': 1.0228375602269129,
      'innerRangeMax': 7.85422478053842,
      'outerRangeMin': -1.9435279868892326,
      'outerRangeMax': 11.181617502705684
    },
    {
      'date': '2017-11-22T00:00:00Z',
      'avg': 4.589339906888078,
      'innerRangeMin': 0.939023257757146,
      'innerRangeMax': 8.23965655601901,
      'outerRangeMin': -1.8945599562468955,
      'outerRangeMax': 11.653151460907592
    },
    {
      'date': '2017-11-23T00:00:00Z',
      'avg': 4.922702782242428,
      'innerRangeMin': 0.9747879483075947,
      'innerRangeMax': 8.870617616177261,
      'outerRangeMin': -1.43223694831004,
      'outerRangeMax': 12.478718115167432
    },
    {
      'date': '2017-11-24T00:00:00Z',
      'avg': 4.916651706962785,
      'innerRangeMin': 0.7745707568478251,
      'innerRangeMax': 9.058732657077744,
      'outerRangeMin': -1.5566186746264417,
      'outerRangeMax': 12.344580685699917
    },
    {
      'date': '2017-11-25T00:00:00Z',
      'avg': 4.4691875071826,
      'innerRangeMin': 0.73932244126271,
      'innerRangeMax': 8.19905257310249,
      'outerRangeMin': -1.7290873122977306,
      'outerRangeMax': 11.1034787103597
    },
    {
      'date': '2017-11-26T00:00:00Z',
      'avg': 4.524292166247808,
      'innerRangeMin': 0.7842777969972023,
      'innerRangeMax': 8.264306535498415,
      'outerRangeMin': -1.4660851504017622,
      'outerRangeMax': 11.51106806939676
    },
    {
      'date': '2017-11-27T00:00:00Z',
      'avg': 4.841386537729999,
      'innerRangeMin': 1.0753793484796814,
      'innerRangeMax': 8.607393726980316,
      'outerRangeMin': -1.7282804864123453,
      'outerRangeMax': 11.72984702021439
    },
    {
      'date': '2017-11-28T00:00:00Z',
      'avg': 5.285224345699016,
      'innerRangeMin': 1.5186625792519584,
      'innerRangeMax': 9.051786112146072,
      'outerRangeMin': -1.4067377571520776,
      'outerRangeMax': 12.245963316080616
    },
    {
      'date': '2017-11-29T00:00:00Z',
      'avg': 5.254267277324254,
      'innerRangeMin': 1.8814051773326907,
      'innerRangeMax': 8.627129377315818,
      'outerRangeMin': -1.1416901263723682,
      'outerRangeMax': 11.886795306081575
    },
    {
      'date': '2017-11-30T00:00:00Z',
      'avg': 5.2583413125299145,
      'innerRangeMin': 2.122084971887024,
      'innerRangeMax': 8.394597653172806,
      'outerRangeMin': -0.7702375739759266,
      'outerRangeMax': 11.39355215619612
    },
    {
      'date': '2017-12-01T00:00:00Z',
      'avg': 5.234060751196454,
      'innerRangeMin': 2.1981834564722544,
      'innerRangeMax': 8.269938045920654,
      'outerRangeMin': -0.7199477406027412,
      'outerRangeMax': 11.393032758633437
    },
    {
      'date': '2017-12-02T00:00:00Z',
      'avg': 5.061889696929917,
      'innerRangeMin': 2.1066140061551204,
      'innerRangeMax': 8.017165387704715,
      'outerRangeMin': -1.1586893984373634,
      'outerRangeMax': 11.364418932153669
    },
    {
      'date': '2017-12-03T00:00:00Z',
      'avg': 5.325341483229128,
      'innerRangeMin': 1.991045823489336,
      'innerRangeMax': 8.659637142968919,
      'outerRangeMin': -1.080627899384401,
      'outerRangeMax': 12.121206980954435
    },
    {
      'date': '2017-12-04T00:00:00Z',
      'avg': 5.2366899884717695,
      'innerRangeMin': 1.8236373020009382,
      'innerRangeMax': 8.649742674942601,
      'outerRangeMin': -1.3601537199138067,
      'outerRangeMax': 12.443087354897086
    },
    {
      'date': '2017-12-05T00:00:00Z',
      'avg': 5.3625344372754205,
      'innerRangeMin': 1.835684227385511,
      'innerRangeMax': 8.889384647165329,
      'outerRangeMin': -1.4574521532493865,
      'outerRangeMax': 12.751321528593877
    },
    {
      'date': '2017-12-06T00:00:00Z',
      'avg': 5.352902368595752,
      'innerRangeMin': 1.9324307358670292,
      'innerRangeMax': 8.773374001324475,
      'outerRangeMin': -0.947733627941659,
      'outerRangeMax': 12.632780139997084
    },
    {
      'date': '2017-12-07T00:00:00Z',
      'avg': 5.36169287853868,
      'innerRangeMin': 1.781782949504227,
      'innerRangeMax': 8.941602807573133,
      'outerRangeMin': -0.8232305916133118,
      'outerRangeMax': 12.93949498411915
    },
    {
      'date': '2017-12-08T00:00:00Z',
      'avg': 5.395540530928892,
      'innerRangeMin': 1.7149074576953867,
      'innerRangeMax': 9.076173604162399,
      'outerRangeMin': -0.734313805709184,
      'outerRangeMax': 13.076173604162399
    },
    {
      'date': '2017-12-09T00:00:00Z',
      'avg': 5.268734216699497,
      'innerRangeMin': 1.8186891547738648,
      'innerRangeMax': 8.718779278625128,
      'outerRangeMin': -0.41960336647744345,
      'outerRangeMax': 12.518892486774114
    },
    {
      'date': '2017-12-10T00:00:00Z',
      'avg': 5.365412158254634,
      'innerRangeMin': 2.0357647406151402,
      'innerRangeMax': 8.695059575894128,
      'outerRangeMin': -0.31650583122987275,
      'outerRangeMax': 12.547723296536054
    },
    {
      'date': '2017-12-11T00:00:00Z',
      'avg': 5.296777571516521,
      'innerRangeMin': 1.9173408482810306,
      'innerRangeMax': 8.676214294752011,
      'outerRangeMin': -0.8231005860451721,
      'outerRangeMax': 12.676214294752011
    },
    {
      'date': '2017-12-12T00:00:00Z',
      'avg': 5.0000485228572105,
      'innerRangeMin': 1.497247619918617,
      'innerRangeMax': 8.502849425795803,
      'outerRangeMin': -1.1092364565932078,
      'outerRangeMax': 12.044892174032988
    },
    {
      'date': '2017-12-13T00:00:00Z',
      'avg': 4.518690380904841,
      'innerRangeMin': 1.5726708223648695,
      'innerRangeMax': 7.464709939444813,
      'outerRangeMin': -0.8105031196786938,
      'outerRangeMax': 11.196306244654185
    },
    {
      'date': '2017-12-14T00:00:00Z',
      'avg': 4.218084643474529,
      'innerRangeMin': 1.0877479284958227,
      'innerRangeMax': 7.348421358453235,
      'outerRangeMin': -0.9713161562281627,
      'outerRangeMax': 11.16925664784358
    },
    {
      'date': '2017-12-15T00:00:00Z',
      'avg': 3.9837202759574604,
      'innerRangeMin': 0.7207054856421355,
      'innerRangeMax': 7.246735066272786,
      'outerRangeMin': -1.6892554710007626,
      'outerRangeMax': 11.246735066272786
    },
    {
      'date': '2017-12-16T00:00:00Z',
      'avg': 3.8083871627783035,
      'innerRangeMin': 0.17345758251159804,
      'innerRangeMax': 7.443316743045009,
      'outerRangeMin': -2.040159341573095,
      'outerRangeMax': 11.44331674304501
    },
    {
      'date': '2017-12-17T00:00:00Z',
      'avg': 3.746252080473408,
      'innerRangeMin': 0.2545772351497355,
      'innerRangeMax': 7.237926925797081,
      'outerRangeMin': -2.0778454583805797,
      'outerRangeMax': 11.23792692579708
    },
    {
      'date': '2017-12-18T00:00:00Z',
      'avg': 3.671112529437431,
      'innerRangeMin': -0.1677052710341611,
      'innerRangeMax': 7.509930329909023,
      'outerRangeMin': -2.1797144752933413,
      'outerRangeMax': 11.509930329909023
    },
    {
      'date': '2017-12-19T00:00:00Z',
      'avg': 3.8831263697452845,
      'innerRangeMin': -0.08633081596169578,
      'innerRangeMax': 7.852583555452265,
      'outerRangeMin': -2.209462493088974,
      'outerRangeMax': 11.315003911669642
    },
    {
      'date': '2017-12-20T00:00:00Z',
      'avg': 3.982317351506099,
      'innerRangeMin': 0.2793217087588329,
      'innerRangeMax': 7.685312994253366,
      'outerRangeMin': -1.9101003938791585,
      'outerRangeMax': 11.238284477734819
    },
    {
      'date': '2017-12-21T00:00:00Z',
      'avg': 3.860609374754466,
      'innerRangeMin': 0.47011089855297605,
      'innerRangeMax': 7.251107850955956,
      'outerRangeMin': -1.7168986759117466,
      'outerRangeMax': 10.54177167882278
    },
    {
      'date': '2017-12-22T00:00:00Z',
      'avg': 3.7524576352716044,
      'innerRangeMin': 0.28287332024220335,
      'innerRangeMax': 7.222041950301005,
      'outerRangeMin': -1.9861610528327187,
      'outerRangeMax': 10.957363411861103
    },
    {
      'date': '2017-12-23T00:00:00Z',
      'avg': 3.8448428180229097,
      'innerRangeMin': -0.11315597919012532,
      'innerRangeMax': 7.802841615235945,
      'outerRangeMin': -2.2893969579862103,
      'outerRangeMax': 11.460733948287467
    },
    {
      'date': '2017-12-24T00:00:00Z',
      'avg': 3.5189153555549932,
      'innerRangeMin': -0.3793855871265448,
      'innerRangeMax': 7.417216298236531,
      'outerRangeMin': -2.8619517553818787,
      'outerRangeMax': 11.147385925795664
    },
    {
      'date': '2017-12-25T00:00:00Z',
      'avg': 3.1249266913206997,
      'innerRangeMin': -0.9285235048205047,
      'innerRangeMax': 7.178376887461904,
      'outerRangeMin': -3.5674737689774254,
      'outerRangeMax': 10.783530913227596
    },
    {
      'date': '2017-12-26T00:00:00Z',
      'avg': 2.9226642873323847,
      'innerRangeMin': -1.2252545446029526,
      'innerRangeMax': 7.070583119267722,
      'outerRangeMin': -3.4881438476274527,
      'outerRangeMax': 10.771776624753091
    },
    {
      'date': '2017-12-27T00:00:00Z',
      'avg': 3.1823509918267083,
      'innerRangeMin': -1.1998559949255103,
      'innerRangeMax': 7.564557978578927,
      'outerRangeMin': -3.2063075562494783,
      'outerRangeMax': 11.204168069912328
    },
    {
      'date': '2017-12-28T00:00:00Z',
      'avg': 3.448895361226983,
      'innerRangeMin': -0.784425399959642,
      'innerRangeMax': 7.682216122413608,
      'outerRangeMin': -2.619043538439503,
      'outerRangeMax': 11.611992914668015
    },
    {
      'date': '2017-12-29T00:00:00Z',
      'avg': 3.823538546385936,
      'innerRangeMin': -0.6644024310789898,
      'innerRangeMax': 8.311479523850862,
      'outerRangeMin': -2.3213301807857336,
      'outerRangeMax': 12.311479523850862
    },
    {
      'date': '2017-12-30T00:00:00Z',
      'avg': 3.5111410825844303,
      'innerRangeMin': -0.8273245719403537,
      'innerRangeMax': 7.849606737109214,
      'outerRangeMin': -2.5056387633216435,
      'outerRangeMax': 11.849606737109214
    },
    {
      'date': '2017-12-31T00:00:00Z',
      'avg': 3.0433096436059657,
      'innerRangeMin': -1.386264033813875,
      'innerRangeMax': 7.472883321025806,
      'outerRangeMin': -2.78070685770269,
      'outerRangeMax': 11.472883321025806
    },
    {
      'date': '2018-01-01T00:00:00Z',
      'avg': 2.5752340849138515,
      'innerRangeMin': -1.4571512642982865,
      'innerRangeMax': 6.60761943412599,
      'outerRangeMin': -2.5678847078028397,
      'outerRangeMax': 10.60761943412599
    },
    {
      'date': '2018-01-02T00:00:00Z',
      'avg': 2.2364390098437466,
      'innerRangeMin': -1.9771982797868373,
      'innerRangeMax': 6.450076299474331,
      'outerRangeMin': -3.158750261739912,
      'outerRangeMax': 10.45007629947433
    },
    {
      'date': '2018-01-03T00:00:00Z',
      'avg': 1.932190328017801,
      'innerRangeMin': -2.6658925926644423,
      'innerRangeMax': 6.530273248700044,
      'outerRangeMin': -3.752193017276936,
      'outerRangeMax': 10.425150152883003
    },
    {
      'date': '2018-01-04T00:00:00Z',
      'avg': 2.231735116552437,
      'innerRangeMin': -2.8505406391084454,
      'innerRangeMax': 7.31401087221332,
      'outerRangeMin': -3.8505406391084454,
      'outerRangeMax': 11.28279877681327
    },
    {
      'date': '2018-01-05T00:00:00Z',
      'avg': 2.5050675933622704,
      'innerRangeMin': -2.805097189184337,
      'innerRangeMax': 7.815232375908877,
      'outerRangeMin': -4.085017764507757,
      'outerRangeMax': 11.815232375908877
    },
    {
      'date': '2018-01-06T00:00:00Z',
      'avg': 2.0759967394383794,
      'innerRangeMin': -3.184025194328251,
      'innerRangeMax': 7.336018673205009,
      'outerRangeMin': -4.29818084807431,
      'outerRangeMax': 11.13529563309166
    },
    {
      'date': '2018-01-07T00:00:00Z',
      'avg': 2.107860471262223,
      'innerRangeMin': -3.272188221777521,
      'innerRangeMax': 7.487909164301968,
      'outerRangeMin': -4.363672839330311,
      'outerRangeMax': 10.94253958552806
    },
    {
      'date': '2018-01-08T00:00:00Z',
      'avg': 1.8327502396209185,
      'innerRangeMin': -3.5172854493406795,
      'innerRangeMax': 7.182785928582517,
      'outerRangeMin': -4.5172854493406795,
      'outerRangeMax': 10.180441708427804
    },
    {
      'date': '2018-01-09T00:00:00Z',
      'avg': 1.6484466528334325,
      'innerRangeMin': -3.563097209673977,
      'innerRangeMax': 6.859990515340842,
      'outerRangeMin': -4.563097209673977,
      'outerRangeMax': 10.048444839801693
    },
    {
      'date': '2018-01-10T00:00:00Z',
      'avg': 1.7296272106612793,
      'innerRangeMin': -3.5598164852308036,
      'innerRangeMax': 7.019070906553362,
      'outerRangeMin': -4.784197494353862,
      'outerRangeMax': 10.127300854816909
    },
    {
      'date': '2018-01-11T00:00:00Z',
      'avg': 1.9627588756811547,
      'innerRangeMin': -3.291999972923072,
      'innerRangeMax': 7.217517724285381,
      'outerRangeMin': -5.031336918035333,
      'outerRangeMax': 10.866714211809384
    },
    {
      'date': '2018-01-12T00:00:00Z',
      'avg': 1.576160603776333,
      'innerRangeMin': -3.635179933748522,
      'innerRangeMax': 6.787501141301187,
      'outerRangeMin': -5.243830360599969,
      'outerRangeMax': 10.096780132438562
    },
    {
      'date': '2018-01-13T00:00:00Z',
      'avg': 1.6529873280142842,
      'innerRangeMin': -3.4289358427192878,
      'innerRangeMax': 6.7349104987478565,
      'outerRangeMin': -4.50778607776657,
      'outerRangeMax': 9.886597682719529
    },
    {
      'date': '2018-01-14T00:00:00Z',
      'avg': 1.217073809284079,
      'innerRangeMin': -3.43723278982966,
      'innerRangeMax': 5.871380408397818,
      'outerRangeMin': -4.43723278982966,
      'outerRangeMax': 8.661834874738005
    },
    {
      'date': '2018-01-15T00:00:00Z',
      'avg': 1.2800359555288772,
      'innerRangeMin': -3.456091370402608,
      'innerRangeMax': 6.016163281460362,
      'outerRangeMin': -4.456091370402608,
      'outerRangeMax': 8.738986002163463
    },
    {
      'date': '2018-01-16T00:00:00Z',
      'avg': 1.3352050766631143,
      'innerRangeMin': -3.424161434014751,
      'innerRangeMax': 6.09457158734098,
      'outerRangeMin': -4.424161434014751,
      'outerRangeMax': 9.344931215332402
    },
    {
      'date': '2018-01-17T00:00:00Z',
      'avg': 1.8870830012360138,
      'innerRangeMin': -2.793530050898114,
      'innerRangeMax': 6.567696053370141,
      'outerRangeMin': -4.264927171683675,
      'outerRangeMax': 10.187831413221225
    },
    {
      'date': '2018-01-18T00:00:00Z',
      'avg': 1.8343282670027672,
      'innerRangeMin': -2.626102024764783,
      'innerRangeMax': 6.294758558770317,
      'outerRangeMin': -4.0982613957871,
      'outerRangeMax': 9.890195031669652
    },
    {
      'date': '2018-01-19T00:00:00Z',
      'avg': 1.7174948798482477,
      'innerRangeMin': -2.495148662173066,
      'innerRangeMax': 5.930138421869562,
      'outerRangeMin': -3.7940592045061496,
      'outerRangeMax': 9.400172014046253
    },
    {
      'date': '2018-01-20T00:00:00Z',
      'avg': 1.8513307171466056,
      'innerRangeMin': -2.292128615133422,
      'innerRangeMax': 5.9947900494266335,
      'outerRangeMin': -3.47132195928423,
      'outerRangeMax': 9.217223692663381
    },
    {
      'date': '2018-01-21T00:00:00Z',
      'avg': 2.1344053405263588,
      'innerRangeMin': -2.065642435340504,
      'innerRangeMax': 6.334453116393222,
      'outerRangeMin': -3.4911415651519935,
      'outerRangeMax': 9.350291153613009
    },
    {
      'date': '2018-01-22T00:00:00Z',
      'avg': 2.0906277550712615,
      'innerRangeMin': -2.052390208929275,
      'innerRangeMax': 6.233645719071799,
      'outerRangeMin': -3.682190406302115,
      'outerRangeMax': 9.643792842386297
    },
    {
      'date': '2018-01-23T00:00:00Z',
      'avg': 2.0401778372590074,
      'innerRangeMin': -2.699259378335898,
      'innerRangeMax': 6.779615052853913,
      'outerRangeMin': -4.727075514705497,
      'outerRangeMax': 10.236257608262624
    },
    {
      'date': '2018-01-24T00:00:00Z',
      'avg': 2.3037109917973893,
      'innerRangeMin': -2.921177927543422,
      'innerRangeMax': 7.528599911138201,
      'outerRangeMin': -5.137220485115787,
      'outerRangeMax': 10.904743071333215
    },
    {
      'date': '2018-01-25T00:00:00Z',
      'avg': 2.224810257944864,
      'innerRangeMin': -3.0911255580139723,
      'innerRangeMax': 7.5407460739036996,
      'outerRangeMin': -4.993021473258679,
      'outerRangeMax': 10.929618787746467
    },
    {
      'date': '2018-01-26T00:00:00Z',
      'avg': 1.8127242257779512,
      'innerRangeMin': -3.1167036649984476,
      'innerRangeMax': 6.74215211655435,
      'outerRangeMin': -4.6860571637549615,
      'outerRangeMax': 9.87232227454853
    },
    {
      'date': '2018-01-27T00:00:00Z',
      'avg': 1.946183463799047,
      'innerRangeMin': -3.221922445903214,
      'innerRangeMax': 7.1142893735013075,
      'outerRangeMin': -4.856855255486908,
      'outerRangeMax': 10.450544934246635
    },
    {
      'date': '2018-01-28T00:00:00Z',
      'avg': 1.7939981763762725,
      'innerRangeMin': -3.523371421765702,
      'innerRangeMax': 7.111367774518246,
      'outerRangeMin': -5.229596785676822,
      'outerRangeMax': 10.884370677535019
    },
    {
      'date': '2018-01-29T00:00:00Z',
      'avg': 1.7872452346519556,
      'innerRangeMin': -3.966697520027409,
      'innerRangeMax': 7.54118798933132,
      'outerRangeMin': -5.692214112574625,
      'outerRangeMax': 11.237292548013656
    },
    {
      'date': '2018-01-30T00:00:00Z',
      'avg': 1.7686887179748578,
      'innerRangeMin': -4.0723224997018175,
      'innerRangeMax': 7.609699935651534,
      'outerRangeMin': -6.204142699612813,
      'outerRangeMax': 11.330376405382603
    },
    {
      'date': '2018-01-31T00:00:00Z',
      'avg': 1.625894395046395,
      'innerRangeMin': -4.428589450059075,
      'innerRangeMax': 7.680378240151866,
      'outerRangeMin': -6.912772175977795,
      'outerRangeMax': 11.300875376774178
    },
    {
      'date': '2018-02-01T00:00:00Z',
      'avg': 1.0453040737559722,
      'innerRangeMin': -4.766035934915715,
      'innerRangeMax': 6.856644082427659,
      'outerRangeMin': -7.083416433104789,
      'outerRangeMax': 10.188351778666657
    },
    {
      'date': '2018-02-02T00:00:00Z',
      'avg': 0.8229704814560083,
      'innerRangeMin': -4.948249006060045,
      'innerRangeMax': 6.594189968972061,
      'outerRangeMin': -7.114025623997703,
      'outerRangeMax': 9.714752578770016
    },
    {
      'date': '2018-02-03T00:00:00Z',
      'avg': 0.7238155689508022,
      'innerRangeMin': -4.72276529876307,
      'innerRangeMax': 6.170396436664674,
      'outerRangeMin': -7.104994391881808,
      'outerRangeMax': 9.150207792176124
    },
    {
      'date': '2018-02-04T00:00:00Z',
      'avg': 0.7898115440816427,
      'innerRangeMin': -4.989737120892073,
      'innerRangeMax': 6.569360209055359,
      'outerRangeMin': -7.180925515684768,
      'outerRangeMax': 10.007515922269016
    },
    {
      'date': '2018-02-05T00:00:00Z',
      'avg': 0.8774332650378572,
      'innerRangeMin': -5.066593263150983,
      'innerRangeMax': 6.821459793226698,
      'outerRangeMin': -7.23412622564884,
      'outerRangeMax': 10.742464653138143
    },
    {
      'date': '2018-02-06T00:00:00Z',
      'avg': 0.9969465037094094,
      'innerRangeMin': -4.753681206319604,
      'innerRangeMax': 6.747574213738424,
      'outerRangeMin': -7.319799345382211,
      'outerRangeMax': 10.747574213738424
    },
    {
      'date': '2018-02-07T00:00:00Z',
      'avg': 0.7786700600144456,
      'innerRangeMin': -5.138885008195755,
      'innerRangeMax': 6.696225128224647,
      'outerRangeMin': -7.8284333568889775,
      'outerRangeMax': 10.421468180906746
    },
    {
      'date': '2018-02-08T00:00:00Z',
      'avg': 0.9464406274563646,
      'innerRangeMin': -4.618471053049785,
      'innerRangeMax': 6.511352307962513,
      'outerRangeMin': -7.233955083785947,
      'outerRangeMax': 10.046751484571628
    },
    {
      'date': '2018-02-09T00:00:00Z',
      'avg': 0.5646297935539082,
      'innerRangeMin': -5.156921840104311,
      'innerRangeMax': 6.286181427212127,
      'outerRangeMin': -7.395298465696376,
      'outerRangeMax': 9.862279460009255
    },
    {
      'date': '2018-02-10T00:00:00Z',
      'avg': 0.8538488153952342,
      'innerRangeMin': -4.96027542218244,
      'innerRangeMax': 6.667973052972909,
      'outerRangeMin': -7.485797155507941,
      'outerRangeMax': 10.41483942413592
    },
    {
      'date': '2018-02-11T00:00:00Z',
      'avg': 1.3409133958812376,
      'innerRangeMin': -4.895496247823895,
      'innerRangeMax': 7.57732303958637,
      'outerRangeMin': -7.83821461272939,
      'outerRangeMax': 11.577323039586371
    },
    {
      'date': '2018-02-12T00:00:00Z',
      'avg': 1.322921015026086,
      'innerRangeMin': -5.3526608326586835,
      'innerRangeMax': 7.998502862710856,
      'outerRangeMin': -8.625474056935758,
      'outerRangeMax': 11.752747072916641
    },
    {
      'date': '2018-02-13T00:00:00Z',
      'avg': 1.509785799540437,
      'innerRangeMin': -5.21724957112537,
      'innerRangeMax': 8.236821170206243,
      'outerRangeMin': -8.17461213459434,
      'outerRangeMax': 11.553845628229118
    },
    {
      'date': '2018-02-14T00:00:00Z',
      'avg': 1.3216275537828088,
      'innerRangeMin': -4.996593564264023,
      'innerRangeMax': 7.63984867182964,
      'outerRangeMin': -7.4915001089278395,
      'outerRangeMax': 10.491768247421135
    },
    {
      'date': '2018-02-15T00:00:00Z',
      'avg': 1.0236679826120043,
      'innerRangeMin': -5.327533659166482,
      'innerRangeMax': 7.37486962439049,
      'outerRangeMin': -8.023102222147259,
      'outerRangeMax': 9.813453302305199
    },
    {
      'date': '2018-02-16T00:00:00Z',
      'avg': 1.3194048355492933,
      'innerRangeMin': -5.081606173648503,
      'innerRangeMax': 7.72041584474709,
      'outerRangeMin': -7.84012665858379,
      'outerRangeMax': 10.24892681538314
    },
    {
      'date': '2018-02-17T00:00:00Z',
      'avg': 1.1817826122969834,
      'innerRangeMin': -5.079577771176563,
      'innerRangeMax': 7.443142995770531,
      'outerRangeMin': -8.274841238620567,
      'outerRangeMax': 9.807042670370695
    },
    {
      'date': '2018-02-18T00:00:00Z',
      'avg': 1.047205895009323,
      'innerRangeMin': -5.428910015286556,
      'innerRangeMax': 7.523321805305203,
      'outerRangeMin': -8.861922959425716,
      'outerRangeMax': 9.612922219556696
    },
    {
      'date': '2018-02-19T00:00:00Z',
      'avg': 0.6251200518183385,
      'innerRangeMin': -6.105741664685255,
      'innerRangeMax': 7.355981768321933,
      'outerRangeMin': -9.201056826154492,
      'outerRangeMax': 9.120822876437616
    },
    {
      'date': '2018-02-20T00:00:00Z',
      'avg': 0.14850457778151172,
      'innerRangeMin': -6.617234500085079,
      'innerRangeMax': 6.914243655648102,
      'outerRangeMin': -9.750589406571581,
      'outerRangeMax': 8.179612431237686
    },
    {
      'date': '2018-02-21T00:00:00Z',
      'avg': 0,
      'innerRangeMin': -6.510085522146603,
      'innerRangeMax': 6.510085522146603,
      'outerRangeMin': -9.282784446205076,
      'outerRangeMax': 7.669387511548445
    },
    {
      'date': '2018-02-22T00:00:00Z',
      'avg': 0.3501944166438268,
      'innerRangeMin': -6.5516237681955785,
      'innerRangeMax': 7.252012601483233,
      'outerRangeMin': -9.268717744680014,
      'outerRangeMax': 8.763990766681157
    },
    {
      'date': '2018-02-23T00:00:00Z',
      'avg': 0.7884604010133394,
      'innerRangeMin': -6.341344226982493,
      'innerRangeMax': 7.918265029009172,
      'outerRangeMin': -8.944534150228188,
      'outerRangeMax': 9.334464390987169
    },
    {
      'date': '2018-02-24T00:00:00Z',
      'avg': 1.339619206321606,
      'innerRangeMin': -6.119278527335609,
      'innerRangeMax': 8.798516939978821,
      'outerRangeMin': -8.680223795990203,
      'outerRangeMax': 10.686301020655208
    },
    {
      'date': '2018-02-25T00:00:00Z',
      'avg': 1.712132771025897,
      'innerRangeMin': -5.813820669476198,
      'innerRangeMax': 9.238086211527992,
      'outerRangeMin': -8.078888094099385,
      'outerRangeMax': 11.01138085728179
    },
    {
      'date': '2018-02-26T00:00:00Z',
      'avg': 1.361764932120035,
      'innerRangeMin': -5.724957238233859,
      'innerRangeMax': 8.44848710247393,
      'outerRangeMin': -8.043822709733288,
      'outerRangeMax': 9.791439479683804
    },
    {
      'date': '2018-02-27T00:00:00Z',
      'avg': 1.015193182304616,
      'innerRangeMin': -5.663001638466389,
      'innerRangeMax': 7.69338800307562,
      'outerRangeMin': -8.086537859411063,
      'outerRangeMax': 9.010651253083939
    },
    {
      'date': '2018-02-28T00:00:00Z',
      'avg': 1.3289948190393208,
      'innerRangeMin': -5.117740848742075,
      'innerRangeMax': 7.775730486820716,
      'outerRangeMin': -7.3788497332826815,
      'outerRangeMax': 8.775730486820716
    },
    {
      'date': '2018-03-01T00:00:00Z',
      'avg': 1.577115742525032,
      'innerRangeMin': -5.303410879434594,
      'innerRangeMax': 8.457642364484657,
      'outerRangeMin': -7.662830078186137,
      'outerRangeMax': 9.800228770975574
    },
    {
      'date': '2018-03-02T00:00:00Z',
      'avg': 1.7822804774793397,
      'innerRangeMin': -5.201675074943936,
      'innerRangeMax': 8.766236029902615,
      'outerRangeMin': -7.822719845026972,
      'outerRangeMax': 10.607182809534251
    },
    {
      'date': '2018-03-03T00:00:00Z',
      'avg': 1.4565171730232616,
      'innerRangeMin': -5.8077871190926125,
      'innerRangeMax': 8.720821465139135,
      'outerRangeMin': -8.815597040208228,
      'outerRangeMax': 10.33968357804034
    },
    {
      'date': '2018-03-04T00:00:00Z',
      'avg': 1.532093757533321,
      'innerRangeMin': -5.8743783888578776,
      'innerRangeMax': 8.93856590392452,
      'outerRangeMin': -8.991679691916927,
      'outerRangeMax': 10.163455746721876
    },
    {
      'date': '2018-03-05T00:00:00Z',
      'avg': 1.197223491371941,
      'innerRangeMin': -6.342817264756727,
      'innerRangeMax': 8.73726424750061,
      'outerRangeMin': -9.26117614590061,
      'outerRangeMax': 9.73726424750061
    },
    {
      'date': '2018-03-06T00:00:00Z',
      'avg': 1.3475109266850394,
      'innerRangeMin': -5.9538457083066625,
      'innerRangeMax': 8.648867561676742,
      'outerRangeMin': -9.029176010499384,
      'outerRangeMax': 9.648867561676742
    },
    {
      'date': '2018-03-07T00:00:00Z',
      'avg': 1.8470919076129049,
      'innerRangeMin': -5.8372060636778045,
      'innerRangeMax': 9.531389878903614,
      'outerRangeMin': -9.146026493785454,
      'outerRangeMax': 10.95940891934691
    },
    {
      'date': '2018-03-08T00:00:00Z',
      'avg': 1.755745771365039,
      'innerRangeMin': -6.244254228634961,
      'innerRangeMax': 9.755745771365039,
      'outerRangeMin': -10.150957456791197,
      'outerRangeMax': 11.504903727733819
    },
    {
      'date': '2018-03-09T00:00:00Z',
      'avg': 1.6044360855556035,
      'innerRangeMin': -6.395563914444397,
      'innerRangeMax': 9.604436085555603,
      'outerRangeMin': -10.0933661073759,
      'outerRangeMax': 11.479172475523162
    },
    {
      'date': '2018-03-10T00:00:00Z',
      'avg': 1.5050425809223926,
      'innerRangeMin': -6.494957419077608,
      'innerRangeMax': 9.505042580922392,
      'outerRangeMin': -10.24012041876098,
      'outerRangeMax': 11.000552400662237
    },
    {
      'date': '2018-03-11T00:00:00Z',
      'avg': 1.2213614229369074,
      'innerRangeMin': -6.773570134158399,
      'innerRangeMax': 9.216292980032215,
      'outerRangeMin': -9.940687401696177,
      'outerRangeMax': 10.22123059440232
    },
    {
      'date': '2018-03-12T00:00:00Z',
      'avg': 1.4913301239557888,
      'innerRangeMin': -6.082495313573638,
      'innerRangeMax': 9.065155561485215,
      'outerRangeMin': -8.91842182759548,
      'outerRangeMax': 10.123150073834319
    },
    {
      'date': '2018-03-13T00:00:00Z',
      'avg': 1.3272741116619786,
      'innerRangeMin': -6.360426715035891,
      'innerRangeMax': 9.014974938359849,
      'outerRangeMin': -9.048523677924418,
      'outerRangeMax': 10.014974938359849
    },
    {
      'date': '2018-03-14T00:00:00Z',
      'avg': 1.9197633849943345,
      'innerRangeMin': -5.819220899682291,
      'innerRangeMax': 9.65874766967096,
      'outerRangeMin': -8.814679368734176,
      'outerRangeMax': 11.074868527044487
    },
    {
      'date': '2018-03-15T00:00:00Z',
      'avg': 2.380956739374422,
      'innerRangeMin': -5.578557400216345,
      'innerRangeMax': 10.34047087896519,
      'outerRangeMin': -8.419907735348295,
      'outerRangeMax': 11.858605626065716
    },
    {
      'date': '2018-03-16T00:00:00Z',
      'avg': 2.6655747471934723,
      'innerRangeMin': -5.168608956991248,
      'innerRangeMax': 10.499758451378193,
      'outerRangeMin': -7.970840868912811,
      'outerRangeMax': 11.653700719872672
    },
    {
      'date': '2018-03-17T00:00:00Z',
      'avg': 2.6622828444575104,
      'innerRangeMin': -4.924263300480414,
      'innerRangeMax': 10.248828989395435,
      'outerRangeMin': -7.4364001431212055,
      'outerRangeMax': 11.248828989395435
    },
    {
      'date': '2018-03-18T00:00:00Z',
      'avg': 2.8711208635824637,
      'innerRangeMin': -4.671195263943769,
      'innerRangeMax': 10.413436991108696,
      'outerRangeMin': -6.672650657791018,
      'outerRangeMax': 11.413436991108696
    },
    {
      'date': '2018-03-19T00:00:00Z',
      'avg': 3.161443312143325,
      'innerRangeMin': -4.68709629716836,
      'innerRangeMax': 11.00998292145501,
      'outerRangeMin': -6.427415111400711,
      'outerRangeMax': 12.171516906218944
    },
    {
      'date': '2018-03-20T00:00:00Z',
      'avg': 3.2335552791807984,
      'innerRangeMin': -4.766444720819202,
      'innerRangeMax': 11.233555279180798,
      'outerRangeMin': -6.540735394961929,
      'outerRangeMax': 12.716323240163153
    },
    {
      'date': '2018-03-21T00:00:00Z',
      'avg': 3.4064355471855996,
      'innerRangeMin': -4.5935644528144,
      'innerRangeMax': 11.4064355471856,
      'outerRangeMin': -6.230302525356831,
      'outerRangeMax': 13.313003083516527
    },
    {
      'date': '2018-03-22T00:00:00Z',
      'avg': 3.166891212054604,
      'innerRangeMin': -4.833108787945395,
      'innerRangeMax': 11.166891212054605,
      'outerRangeMin': -6.834527817036236,
      'outerRangeMax': 12.7846486179799
    },
    {
      'date': '2018-03-23T00:00:00Z',
      'avg': 3.191324595862161,
      'innerRangeMin': -4.783944170821656,
      'innerRangeMax': 11.166593362545978,
      'outerRangeMin': -6.933564278495993,
      'outerRangeMax': 12.51054226228777
    },
    {
      'date': '2018-03-24T00:00:00Z',
      'avg': 3.1308972545176124,
      'innerRangeMin': -4.267311599374669,
      'innerRangeMax': 10.529106108409895,
      'outerRangeMin': -6.376804429334726,
      'outerRangeMax': 11.529106108409895
    },
    {
      'date': '2018-03-25T00:00:00Z',
      'avg': 3.4603336343809117,
      'innerRangeMin': -3.9697704086575625,
      'innerRangeMax': 10.890437677419385,
      'outerRangeMin': -5.676927067643675,
      'outerRangeMax': 11.890437677419385
    },
    {
      'date': '2018-03-26T00:00:00Z',
      'avg': 3.340210948665784,
      'innerRangeMin': -4.179828152558314,
      'innerRangeMax': 10.860250049889881,
      'outerRangeMin': -6.139778987994023,
      'outerRangeMax': 12.39208652705867
    },
    {
      'date': '2018-03-27T00:00:00Z',
      'avg': 3.932288040561132,
      'innerRangeMin': -4.067711959438868,
      'innerRangeMax': 11.932288040561133,
      'outerRangeMin': -6.509596673038272,
      'outerRangeMax': 13.83530373399563
    },
    {
      'date': '2018-03-28T00:00:00Z',
      'avg': 4.241823486362115,
      'innerRangeMin': -3.482672532604294,
      'innerRangeMax': 11.966319505328524,
      'outerRangeMin': -5.84711709737115,
      'outerRangeMax': 13.852671070099927
    },
    {
      'date': '2018-03-29T00:00:00Z',
      'avg': 3.9679065295974714,
      'innerRangeMin': -3.846920521244432,
      'innerRangeMax': 11.782733580439375,
      'outerRangeMin': -6.417369780213413,
      'outerRangeMax': 13.223944950215232
    },
    {
      'date': '2018-03-30T00:00:00Z',
      'avg': 3.479271474617288,
      'innerRangeMin': -4.259135164800028,
      'innerRangeMax': 11.217678114034605,
      'outerRangeMin': -6.550440144309199,
      'outerRangeMax': 12.8206006297337
    },
    {
      'date': '2018-03-31T00:00:00Z',
      'avg': 3.6632156181278894,
      'innerRangeMin': -3.8964104982812326,
      'innerRangeMax': 11.222841734537012,
      'outerRangeMin': -6.429530151502035,
      'outerRangeMax': 12.450087614119058
    },
    {
      'date': '2018-04-01T00:00:00Z',
      'avg': 3.454893229069251,
      'innerRangeMin': -4.077011673500075,
      'innerRangeMax': 10.986798131638576,
      'outerRangeMin': -7.047512820128755,
      'outerRangeMax': 12.45240660459746
    },
    {
      'date': '2018-04-02T00:00:00Z',
      'avg': 3.732695788323735,
      'innerRangeMin': -4.267304211676265,
      'innerRangeMax': 11.732695788323735,
      'outerRangeMin': -7.095066111299289,
      'outerRangeMax': 13.231750212440108
    },
    {
      'date': '2018-04-03T00:00:00Z',
      'avg': 4.030194001646515,
      'innerRangeMin': -3.9698059983534852,
      'innerRangeMax': 12.030194001646514,
      'outerRangeMin': -7.253034763584134,
      'outerRangeMax': 13.490160103798102
    },
    {
      'date': '2018-04-04T00:00:00Z',
      'avg': 3.9648374646805014,
      'innerRangeMin': -4.035162535319499,
      'innerRangeMax': 11.964837464680501,
      'outerRangeMin': -7.277201071184466,
      'outerRangeMax': 13.18399392773004
    },
    {
      'date': '2018-04-05T00:00:00Z',
      'avg': 4.080306286066582,
      'innerRangeMin': -3.665147698724776,
      'innerRangeMax': 11.825760270857941,
      'outerRangeMin': -7.0133561191033005,
      'outerRangeMax': 13.099719733999779
    },
    {
      'date': '2018-04-06T00:00:00Z',
      'avg': 4.142520649314928,
      'innerRangeMin': -3.5189747578472703,
      'innerRangeMax': 11.804016056477128,
      'outerRangeMin': -6.566318607269385,
      'outerRangeMax': 12.943901876188361
    },
    {
      'date': '2018-04-07T00:00:00Z',
      'avg': 3.8872568726295267,
      'innerRangeMin': -3.80028880798257,
      'innerRangeMax': 11.574802553241623,
      'outerRangeMin': -7.03578807841862,
      'outerRangeMax': 12.86748421434602
    },
    {
      'date': '2018-04-08T00:00:00Z',
      'avg': 3.979509270199914,
      'innerRangeMin': -3.8491690806037884,
      'innerRangeMax': 11.808187621003617,
      'outerRangeMin': -7.1760282935998845,
      'outerRangeMax': 13.226834400375994
    },
    {
      'date': '2018-04-09T00:00:00Z',
      'avg': 4.146249005106157,
      'innerRangeMin': -3.544889158774488,
      'innerRangeMax': 11.837387168986803,
      'outerRangeMin': -7.223019135569404,
      'outerRangeMax': 13.7812961292556
    },
    {
      'date': '2018-04-10T00:00:00Z',
      'avg': 4.248471557062319,
      'innerRangeMin': -3.1675627809079447,
      'innerRangeMax': 11.664505895032583,
      'outerRangeMin': -7.151796201621773,
      'outerRangeMax': 13.555925608334414
    },
    {
      'date': '2018-04-11T00:00:00Z',
      'avg': 3.721822627077756,
      'innerRangeMin': -3.6361614745622206,
      'innerRangeMax': 11.079806728717733,
      'outerRangeMin': -7.400665097208735,
      'outerRangeMax': 13.19396947997527
    },
    {
      'date': '2018-04-12T00:00:00Z',
      'avg': 3.7662645259551306,
      'innerRangeMin': -3.3733984946412896,
      'innerRangeMax': 10.90592754655155,
      'outerRangeMin': -7.193118648750073,
      'outerRangeMax': 13.008994564427647
    },
    {
      'date': '2018-04-13T00:00:00Z',
      'avg': 4.009729848285367,
      'innerRangeMin': -2.987231482201117,
      'innerRangeMax': 11.006691178771852,
      'outerRangeMin': -6.650739248413433,
      'outerRangeMax': 12.980620420162083
    },
    {
      'date': '2018-04-14T00:00:00Z',
      'avg': 4.508861808656569,
      'innerRangeMin': -2.3042434252584174,
      'innerRangeMax': 11.321967042571554,
      'outerRangeMin': -6.521488768001575,
      'outerRangeMax': 13.221598059200035
    },
    {
      'date': '2018-04-15T00:00:00Z',
      'avg': 5.091526799594248,
      'innerRangeMin': -2.241920183367294,
      'innerRangeMax': 12.424973782555789,
      'outerRangeMin': -6.557344547482311,
      'outerRangeMax': 14.606824249475428
    },
    {
      'date': '2018-04-16T00:00:00Z',
      'avg': 5.115932491953137,
      'innerRangeMin': -1.964849972566645,
      'innerRangeMax': 12.196714956472919,
      'outerRangeMin': -6.288355948643906,
      'outerRangeMax': 14.472158967280006
    },
    {
      'date': '2018-04-17T00:00:00Z',
      'avg': 5.36026082238724,
      'innerRangeMin': -1.934128207616971,
      'innerRangeMax': 12.65464985239145,
      'outerRangeMin': -6.197240362138835,
      'outerRangeMax': 15.083727690362306
    },
    {
      'date': '2018-04-18T00:00:00Z',
      'avg': 4.814271027794472,
      'innerRangeMin': -2.0297591804379627,
      'innerRangeMax': 11.658301236026908,
      'outerRangeMin': -5.949153159069863,
      'outerRangeMax': 13.69536426169614
    },
    {
      'date': '2018-04-19T00:00:00Z',
      'avg': 4.564556300567624,
      'innerRangeMin': -1.9026034454478218,
      'innerRangeMax': 11.03171604658307,
      'outerRangeMin': -5.719462153061009,
      'outerRangeMax': 13.285620397678453
    },
    {
      'date': '2018-04-20T00:00:00Z',
      'avg': 4.969266629355254,
      'innerRangeMin': -1.8954279056624603,
      'innerRangeMax': 11.833961164372969,
      'outerRangeMin': -6.2094554784100024,
      'outerRangeMax': 14.559991343492168
    },
    {
      'date': '2018-04-21T00:00:00Z',
      'avg': 5.099782785880235,
      'innerRangeMin': -1.861873258824886,
      'innerRangeMax': 12.061438830585356,
      'outerRangeMin': -6.039552921734922,
      'outerRangeMax': 15.299610266355744
    },
    {
      'date': '2018-04-22T00:00:00Z',
      'avg': 4.8728768706341485,
      'innerRangeMin': -2.2076613052916443,
      'innerRangeMax': 11.953415046559941,
      'outerRangeMin': -6.148609677587766,
      'outerRangeMax': 15.295150914178276
    },
    {
      'date': '2018-04-23T00:00:00Z',
      'avg': 4.822439257959455,
      'innerRangeMin': -1.8801224630704834,
      'innerRangeMax': 11.525000978989393,
      'outerRangeMin': -5.621414878985249,
      'outerRangeMax': 14.969397810771138
    },
    {
      'date': '2018-04-24T00:00:00Z',
      'avg': 4.925436503853789,
      'innerRangeMin': -1.2401316594197977,
      'innerRangeMax': 11.091004667127375,
      'outerRangeMin': -4.875040817282183,
      'outerRangeMax': 14.545533001073565
    },
    {
      'date': '2018-04-25T00:00:00Z',
      'avg': 4.683743811311961,
      'innerRangeMin': -1.1647983969521727,
      'innerRangeMax': 10.532286019576095,
      'outerRangeMin': -4.339646025136368,
      'outerRangeMax': 13.604711294769594
    },
    {
      'date': '2018-04-26T00:00:00Z',
      'avg': 4.822220757062392,
      'innerRangeMin': -1.1497649792302918,
      'innerRangeMax': 10.794206493355077,
      'outerRangeMin': -4.321030146945118,
      'outerRangeMax': 14.247007817084834
    },
    {
      'date': '2018-04-27T00:00:00Z',
      'avg': 4.681850402510293,
      'innerRangeMin': -1.2067242584769335,
      'innerRangeMax': 10.57042506349752,
      'outerRangeMin': -4.8186578244596845,
      'outerRangeMax': 14.38826109321553
    },
    {
      'date': '2018-04-28T00:00:00Z',
      'avg': 4.916522911412731,
      'innerRangeMin': -1.1847764127846654,
      'innerRangeMax': 11.017822235610126,
      'outerRangeMin': -4.545598956221951,
      'outerRangeMax': 14.746454383358792
    },
    {
      'date': '2018-04-29T00:00:00Z',
      'avg': 4.825802154979575,
      'innerRangeMin': -1.3835019710715457,
      'innerRangeMax': 11.035106281030696,
      'outerRangeMin': -4.638559019046927,
      'outerRangeMax': 14.343135852239808
    },
    {
      'date': '2018-04-30T00:00:00Z',
      'avg': 4.434519727098402,
      'innerRangeMin': -1.7711359177528783,
      'innerRangeMax': 10.640175371949681,
      'outerRangeMin': -5.017647225801952,
      'outerRangeMax': 14.05023165765196
    },
    {
      'date': '2018-05-01T00:00:00Z',
      'avg': 4.077302872988667,
      'innerRangeMin': -1.9729859796846387,
      'innerRangeMax': 10.127591725661972,
      'outerRangeMin': -4.8707618605862315,
      'outerRangeMax': 13.692478899125867
    },
    {
      'date': '2018-05-02T00:00:00Z',
      'avg': 4.247592420832008,
      'innerRangeMin': -1.4532453879061515,
      'innerRangeMax': 9.948430229570167,
      'outerRangeMin': -3.981889662258472,
      'outerRangeMax': 13.326888877117462
    },
    {
      'date': '2018-05-03T00:00:00Z',
      'avg': 4.819575593894207,
      'innerRangeMin': -1.1776089151549662,
      'innerRangeMax': 10.81676010294338,
      'outerRangeMin': -3.5894545467609484,
      'outerRangeMax': 14.342845081040501
    },
    {
      'date': '2018-05-04T00:00:00Z',
      'avg': 5.269928891316485,
      'innerRangeMin': -1.1146082570260765,
      'innerRangeMax': 11.654466039659045,
      'outerRangeMin': -3.972289405923086,
      'outerRangeMax': 15.426185595546578
    },
    {
      'date': '2018-05-05T00:00:00Z',
      'avg': 4.959998423010126,
      'innerRangeMin': -1.2103406888040338,
      'innerRangeMax': 11.130337534824285,
      'outerRangeMin': -3.7625054070417665,
      'outerRangeMax': 15.044902796788515
    },
    {
      'date': '2018-05-06T00:00:00Z',
      'avg': 4.538183595604537,
      'innerRangeMin': -1.5542733109437865,
      'innerRangeMax': 10.630640502152861,
      'outerRangeMin': -3.926641763287301,
      'outerRangeMax': 14.630640502152861
    },
    {
      'date': '2018-05-07T00:00:00Z',
      'avg': 4.126407836029323,
      'innerRangeMin': -2.143062082257492,
      'innerRangeMax': 10.395877754316137,
      'outerRangeMin': -4.278563759933103,
      'outerRangeMax': 14.332040423565847
    },
    {
      'date': '2018-05-08T00:00:00Z',
      'avg': 4.287316145242228,
      'innerRangeMin': -1.7448334884739483,
      'innerRangeMax': 10.319465778958403,
      'outerRangeMin': -4.213303023413851,
      'outerRangeMax': 13.816793923001507
    },
    {
      'date': '2018-05-09T00:00:00Z',
      'avg': 4.039217851792682,
      'innerRangeMin': -1.8681341158017224,
      'innerRangeMax': 9.946569819387086,
      'outerRangeMin': -4.289380888567043,
      'outerRangeMax': 13.793145194488597
    },
    {
      'date': '2018-05-10T00:00:00Z',
      'avg': 4.194762314676577,
      'innerRangeMin': -1.5477611352265797,
      'innerRangeMax': 9.937285764579734,
      'outerRangeMin': -3.9390935524012516,
      'outerRangeMax': 13.937285764579734
    },
    {
      'date': '2018-05-11T00:00:00Z',
      'avg': 3.9538849229913637,
      'innerRangeMin': -1.7739446372794099,
      'innerRangeMax': 9.681714483262137,
      'outerRangeMin': -4.458756297530013,
      'outerRangeMax': 13.632784438415012
    },
    {
      'date': '2018-05-12T00:00:00Z',
      'avg': 4.011259596516711,
      'innerRangeMin': -1.9118609515073413,
      'innerRangeMax': 9.934380144540762,
      'outerRangeMin': -4.3535723580003,
      'outerRangeMax': 13.731692420892736
    },
    {
      'date': '2018-05-13T00:00:00Z',
      'avg': 3.6993504934911083,
      'innerRangeMin': -2.1852129096811455,
      'innerRangeMax': 9.583913896663361,
      'outerRangeMin': -4.14061552249286,
      'outerRangeMax': 13.223661570185246
    },
    {
      'date': '2018-05-14T00:00:00Z',
      'avg': 3.64216679633336,
      'innerRangeMin': -2.4306219388468615,
      'innerRangeMax': 9.714955531513581,
      'outerRangeMin': -4.610397504703254,
      'outerRangeMax': 13.324945491656369
    },
    {
      'date': '2018-05-15T00:00:00Z',
      'avg': 3.675966214859259,
      'innerRangeMin': -2.4688340045153225,
      'innerRangeMax': 9.82076643423384,
      'outerRangeMin': -4.54660019987543,
      'outerRangeMax': 13.684166854677986
    },
    {
      'date': '2018-05-16T00:00:00Z',
      'avg': 3.7910603776204006,
      'innerRangeMin': -2.184249343480845,
      'innerRangeMax': 9.766370098721646,
      'outerRangeMin': -4.7944298196130175,
      'outerRangeMax': 13.7511253972222
    },
    {
      'date': '2018-05-17T00:00:00Z',
      'avg': 3.8333031698220585,
      'innerRangeMin': -1.956043917694159,
      'innerRangeMax': 9.622650257338275,
      'outerRangeMin': -4.4204463830597,
      'outerRangeMax': 13.622650257338275
    },
    {
      'date': '2018-05-18T00:00:00Z',
      'avg': 3.6754528520424232,
      'innerRangeMin': -2.2421581948743805,
      'innerRangeMax': 9.593063898959226,
      'outerRangeMin': -4.321300745384725,
      'outerRangeMax': 13.480316721527318
    },
    {
      'date': '2018-05-19T00:00:00Z',
      'avg': 3.1893993964157175,
      'innerRangeMin': -2.2816866621850314,
      'innerRangeMax': 8.660485455016467,
      'outerRangeMin': -4.477580356586412,
      'outerRangeMax': 12.635381160992099
    },
    {
      'date': '2018-05-20T00:00:00Z',
      'avg': 3.4176286491480115,
      'innerRangeMin': -2.2517094450627697,
      'innerRangeMax': 9.086966743358794,
      'outerRangeMin': -4.309314307407698,
      'outerRangeMax': 12.938521435048324
    },
    {
      'date': '2018-05-21T00:00:00Z',
      'avg': 3.122470757072416,
      'innerRangeMin': -2.5913648457410465,
      'innerRangeMax': 8.836306359885878,
      'outerRangeMin': -4.737832245290681,
      'outerRangeMax': 12.836306359885878
    },
    {
      'date': '2018-05-22T00:00:00Z',
      'avg': 3.3737399550148073,
      'innerRangeMin': -2.388970075934318,
      'innerRangeMax': 9.136449985963932,
      'outerRangeMin': -4.5837008703530095,
      'outerRangeMax': 13.136449985963932
    },
    {
      'date': '2018-05-23T00:00:00Z',
      'avg': 3.2562341161273713,
      'innerRangeMin': -2.717254530494398,
      'innerRangeMax': 9.229722762749141,
      'outerRangeMin': -5.069291023629541,
      'outerRangeMax': 13.11384099499104
    },
    {
      'date': '2018-05-24T00:00:00Z',
      'avg': 3.303954137212258,
      'innerRangeMin': -2.3972782949663434,
      'innerRangeMax': 9.00518656939086,
      'outerRangeMin': -4.4128892934166295,
      'outerRangeMax': 13.00518656939086
    },
    {
      'date': '2018-05-25T00:00:00Z',
      'avg': 2.754920257542211,
      'innerRangeMin': -2.6733661762793055,
      'innerRangeMax': 8.183206691363727,
      'outerRangeMin': -4.6562538064063475,
      'outerRangeMax': 12.027873973934243
    },
    {
      'date': '2018-05-26T00:00:00Z',
      'avg': 2.1961178989006496,
      'innerRangeMin': -2.689395301278774,
      'innerRangeMax': 7.081631099080074,
      'outerRangeMin': -4.186137675645192,
      'outerRangeMax': 10.809234698101998
    },
    {
      'date': '2018-05-27T00:00:00Z',
      'avg': 2.1355399165256936,
      'innerRangeMin': -2.4710324361558738,
      'innerRangeMax': 6.7421122692072615,
      'outerRangeMin': -3.795707394616602,
      'outerRangeMax': 10.088435002080056
    },
    {
      'date': '2018-05-28T00:00:00Z',
      'avg': 2.6968721894702097,
      'innerRangeMin': -1.7390245473113803,
      'innerRangeMax': 7.132768926251799,
      'outerRangeMin': -3.3833314663132117,
      'outerRangeMax': 10.253688385018627
    },
    {
      'date': '2018-05-29T00:00:00Z',
      'avg': 2.9931931014032993,
      'innerRangeMin': -1.905404315429028,
      'innerRangeMax': 7.891790518235627,
      'outerRangeMin': -3.915007362429951,
      'outerRangeMax': 11.380993411044766
    },
    {
      'date': '2018-05-30T00:00:00Z',
      'avg': 2.726675943735692,
      'innerRangeMin': -2.0374800450442607,
      'innerRangeMax': 7.490831932515645,
      'outerRangeMin': -3.8102823291565358,
      'outerRangeMax': 10.831633533246343
    },
    {
      'date': '2018-05-31T00:00:00Z',
      'avg': 2.423355879556717,
      'innerRangeMin': -2.013736911158814,
      'innerRangeMax': 6.860448670272248,
      'outerRangeMin': -3.291564061179841,
      'outerRangeMax': 9.98285870384522
    },
    {
      'date': '2018-06-01T00:00:00Z',
      'avg': 2.494059368906314,
      'innerRangeMin': -2.1412848879367563,
      'innerRangeMax': 7.129403625749385,
      'outerRangeMin': -3.1412848879367563,
      'outerRangeMax': 10.381613803293673
    },
    {
      'date': '2018-06-02T00:00:00Z',
      'avg': 2.156402136400025,
      'innerRangeMin': -2.356245905199867,
      'innerRangeMax': 6.669050177999917,
      'outerRangeMin': -3.6162291878714474,
      'outerRangeMax': 9.580688846453976
    },
    {
      'date': '2018-06-03T00:00:00Z',
      'avg': 2.577992732892281,
      'innerRangeMin': -2.3864810561969145,
      'innerRangeMax': 7.542466521981477,
      'outerRangeMin': -3.8573234880526006,
      'outerRangeMax': 10.199195240601728
    },
    {
      'date': '2018-06-04T00:00:00Z',
      'avg': 2.6019860164210025,
      'innerRangeMin': -2.3203161544261945,
      'innerRangeMax': 7.5242881872681995,
      'outerRangeMin': -3.71751539698699,
      'outerRangeMax': 10.727879777078376
    },
    {
      'date': '2018-06-05T00:00:00Z',
      'avg': 2.382083948626242,
      'innerRangeMin': -2.695432017793294,
      'innerRangeMax': 7.459599915045779,
      'outerRangeMin': -4.123938690257386,
      'outerRangeMax': 11.141983530490187
    },
    {
      'date': '2018-06-06T00:00:00Z',
      'avg': 2.601910342828456,
      'innerRangeMin': -2.298843534787817,
      'innerRangeMax': 7.5026642204447285,
      'outerRangeMin': -3.9855700580920574,
      'outerRangeMax': 10.740926074029375
    },
    {
      'date': '2018-06-07T00:00:00Z',
      'avg': 2.3435599349961027,
      'innerRangeMin': -2.5518992241136376,
      'innerRangeMax': 7.239019094105843,
      'outerRangeMin': -3.7973554318891636,
      'outerRangeMax': 10.185552885780446
    },
    {
      'date': '2018-06-08T00:00:00Z',
      'avg': 1.8811758058785117,
      'innerRangeMin': -2.643491354543191,
      'innerRangeMax': 6.405842966300215,
      'outerRangeMin': -3.643491354543191,
      'outerRangeMax': 9.387430819127069
    },
    {
      'date': '2018-06-09T00:00:00Z',
      'avg': 1.9559721670305672,
      'innerRangeMin': -2.4701737101886367,
      'innerRangeMax': 6.382118044249771,
      'outerRangeMin': -3.5103550686592206,
      'outerRangeMax': 9.065700931953632
    },
    {
      'date': '2018-06-10T00:00:00Z',
      'avg': 2.2272054386970406,
      'innerRangeMin': -2.7436425961319695,
      'innerRangeMax': 7.19805347352605,
      'outerRangeMin': -3.7436425961319695,
      'outerRangeMax': 9.989342051930937
    },
    {
      'date': '2018-06-11T00:00:00Z',
      'avg': 2.4428495346516694,
      'innerRangeMin': -2.73404420385914,
      'innerRangeMax': 7.619743273162479,
      'outerRangeMin': -4.001986962106944,
      'outerRangeMax': 10.72729341507922
    },
    {
      'date': '2018-06-12T00:00:00Z',
      'avg': 2.019028714338884,
      'innerRangeMin': -3.0318291306686906,
      'innerRangeMax': 7.069886559346459,
      'outerRangeMin': -4.288893931269128,
      'outerRangeMax': 10.290362481254892
    },
    {
      'date': '2018-06-13T00:00:00Z',
      'avg': 2.0196626042375643,
      'innerRangeMin': -2.831382961255592,
      'innerRangeMax': 6.870708169730721,
      'outerRangeMin': -4.113558322501119,
      'outerRangeMax': 9.550384367185204
    },
    {
      'date': '2018-06-14T00:00:00Z',
      'avg': 1.9994349206392497,
      'innerRangeMin': -2.766419398470156,
      'innerRangeMax': 6.765289239748656,
      'outerRangeMin': -4.165948886169701,
      'outerRangeMax': 9.000155380188819
    },
    {
      'date': '2018-06-15T00:00:00Z',
      'avg': 2.297222431454764,
      'innerRangeMin': -2.2601303827907717,
      'innerRangeMax': 6.8545752457003,
      'outerRangeMin': -4.068611206744697,
      'outerRangeMax': 9.321574829627055
    },
    {
      'date': '2018-06-16T00:00:00Z',
      'avg': 2.7361036496145443,
      'innerRangeMin': -2.092345361340744,
      'innerRangeMax': 7.5645526605698326,
      'outerRangeMin': -4.400485483505314,
      'outerRangeMax': 10.53696333796741
    },
    {
      'date': '2018-06-17T00:00:00Z',
      'avg': 3.1238072350509416,
      'innerRangeMin': -2.2314598132991366,
      'innerRangeMax': 8.479074283401019,
      'outerRangeMin': -4.897902747539237,
      'outerRangeMax': 11.30108397426351
    },
    {
      'date': '2018-06-18T00:00:00Z',
      'avg': 3.4020142482262807,
      'innerRangeMin': -2.130650573185946,
      'innerRangeMax': 8.934679069638507,
      'outerRangeMin': -4.460445908877036,
      'outerRangeMax': 11.793140127132158
    },
    {
      'date': '2018-06-19T00:00:00Z',
      'avg': 3.0154086408167036,
      'innerRangeMin': -2.645904005206919,
      'innerRangeMax': 8.676721286840326,
      'outerRangeMin': -5.154811829139301,
      'outerRangeMax': 11.242301820986462
    },
    {
      'date': '2018-06-20T00:00:00Z',
      'avg': 2.9000007894540025,
      'innerRangeMin': -2.8976400867614847,
      'innerRangeMax': 8.69764166566949,
      'outerRangeMin': -5.056408443644541,
      'outerRangeMax': 10.681788178696177
    },
    {
      'date': '2018-06-21T00:00:00Z',
      'avg': 2.546264037129555,
      'innerRangeMin': -3.568223940561144,
      'innerRangeMax': 8.660752014820254,
      'outerRangeMin': -5.4174062131933844,
      'outerRangeMax': 10.638916143335825
    },
    {
      'date': '2018-06-22T00:00:00Z',
      'avg': 2.6837354312467605,
      'innerRangeMin': -3.304413716792925,
      'innerRangeMax': 8.671884579286445,
      'outerRangeMin': -4.909042273635871,
      'outerRangeMax': 10.554944495777326
    },
    {
      'date': '2018-06-23T00:00:00Z',
      'avg': 3.061957610156834,
      'innerRangeMin': -3.276801784354584,
      'innerRangeMax': 9.400717004668252,
      'outerRangeMin': -4.9571703338058155,
      'outerRangeMax': 11.795055788856907
    },
    {
      'date': '2018-06-24T00:00:00Z',
      'avg': 2.8773764825095154,
      'innerRangeMin': -3.137563897323631,
      'innerRangeMax': 8.892316862342662,
      'outerRangeMin': -4.582756289633005,
      'outerRangeMax': 11.483617731224733
    },
    {
      'date': '2018-06-25T00:00:00Z',
      'avg': 3.048178809366809,
      'innerRangeMin': -3.0133389108439745,
      'innerRangeMax': 9.109696529577594,
      'outerRangeMin': -4.7043570871803695,
      'outerRangeMax': 11.576309942093163
    },
    {
      'date': '2018-06-26T00:00:00Z',
      'avg': 2.82433123874897,
      'innerRangeMin': -3.3718192675858942,
      'innerRangeMax': 9.020481745083835,
      'outerRangeMin': -5.012866867146575,
      'outerRangeMax': 10.924620104281372
    },
    {
      'date': '2018-06-27T00:00:00Z',
      'avg': 2.8979255590885638,
      'innerRangeMin': -3.4086404370421572,
      'innerRangeMax': 9.204491555219285,
      'outerRangeMin': -5.249626480833712,
      'outerRangeMax': 10.878579261931456
    },
    {
      'date': '2018-06-28T00:00:00Z',
      'avg': 2.6815187301938073,
      'innerRangeMin': -4.015415374754841,
      'innerRangeMax': 9.378452835142456,
      'outerRangeMin': -5.639544952463746,
      'outerRangeMax': 11.306943565870252
    },
    {
      'date': '2018-06-29T00:00:00Z',
      'avg': 2.539515692005841,
      'innerRangeMin': -4.4102674032668965,
      'innerRangeMax': 9.489298787278578,
      'outerRangeMin': -6.141209127410259,
      'outerRangeMax': 11.76044303648488
    },
    {
      'date': '2018-06-30T00:00:00Z',
      'avg': 2.7617585060353584,
      'innerRangeMin': -3.9389736234095873,
      'innerRangeMax': 9.462490635480304,
      'outerRangeMin': -6.148043390255304,
      'outerRangeMax': 11.679152283698015
    },
    {
      'date': '2018-07-01T00:00:00Z',
      'avg': 2.762031693884538,
      'innerRangeMin': -4.18783775627535,
      'innerRangeMax': 9.711901144044427,
      'outerRangeMin': -6.111094643480624,
      'outerRangeMax': 11.857511046133729
    },
    {
      'date': '2018-07-02T00:00:00Z',
      'avg': 2.42912104765809,
      'innerRangeMin': -4.3886698317490325,
      'innerRangeMax': 9.246911927065211,
      'outerRangeMin': -6.316915287661753,
      'outerRangeMax': 11.215891895492456
    },
    {
      'date': '2018-07-03T00:00:00Z',
      'avg': 2.3496916350393837,
      'innerRangeMin': -4.141757759154667,
      'innerRangeMax': 8.841141029233434,
      'outerRangeMin': -5.738613512187066,
      'outerRangeMax': 10.471833285903752
    },
    {
      'date': '2018-07-04T00:00:00Z',
      'avg': 2.624613504284039,
      'innerRangeMin': -3.9344735318373405,
      'innerRangeMax': 9.183700540405418,
      'outerRangeMin': -5.348471902041174,
      'outerRangeMax': 10.549230440542207
    },
    {
      'date': '2018-07-05T00:00:00Z',
      'avg': 3.002262532028976,
      'innerRangeMin': -3.5911646452413195,
      'innerRangeMax': 9.595689709299272,
      'outerRangeMin': -4.925402819644891,
      'outerRangeMax': 10.876309126676109
    },
    {
      'date': '2018-07-06T00:00:00Z',
      'avg': 3.492547826029018,
      'innerRangeMin': -3.4542393694561864,
      'innerRangeMax': 10.439335021514223,
      'outerRangeMin': -5.248702275782945,
      'outerRangeMax': 12.019465862750266
    },
    {
      'date': '2018-07-07T00:00:00Z',
      'avg': 3.272005509838035,
      'innerRangeMin': -3.366861921192597,
      'innerRangeMax': 9.910872940868668,
      'outerRangeMin': -5.409120531286398,
      'outerRangeMax': 11.284158251154674
    },
    {
      'date': '2018-07-08T00:00:00Z',
      'avg': 3.0009691815065382,
      'innerRangeMin': -3.404431748289345,
      'innerRangeMax': 9.406370111302422,
      'outerRangeMin': -5.04690735272601,
      'outerRangeMax': 10.559127622698657
    },
    {
      'date': '2018-07-09T00:00:00Z',
      'avg': 2.8739586590297757,
      'innerRangeMin': -3.5850287399798884,
      'innerRangeMax': 9.33294605803944,
      'outerRangeMin': -5.269589579024272,
      'outerRangeMax': 10.33294605803944
    },
    {
      'date': '2018-07-10T00:00:00Z',
      'avg': 2.9147694664357737,
      'innerRangeMin': -3.278264093388237,
      'innerRangeMax': 9.107803026259784,
      'outerRangeMin': -4.910548680055954,
      'outerRangeMax': 10.14012161824273
    },
    {
      'date': '2018-07-11T00:00:00Z',
      'avg': 3.4067147948142718,
      'innerRangeMin': -2.927484351066165,
      'innerRangeMax': 9.740913940694709,
      'outerRangeMin': -4.861403421682594,
      'outerRangeMax': 10.740913940694709
    },
    {
      'date': '2018-07-12T00:00:00Z',
      'avg': 3.7285326209873686,
      'innerRangeMin': -2.402033874173674,
      'innerRangeMax': 9.85909911614841,
      'outerRangeMin': -4.659233076043021,
      'outerRangeMax': 11.026437813851107
    },
    {
      'date': '2018-07-13T00:00:00Z',
      'avg': 3.9776006144521787,
      'innerRangeMin': -2.404288996383234,
      'innerRangeMax': 10.35949022528759,
      'outerRangeMin': -4.663774838259973,
      'outerRangeMax': 11.81971187453135
    },
    {
      'date': '2018-07-14T00:00:00Z',
      'avg': 4.047212149971589,
      'innerRangeMin': -2.4704346740055323,
      'innerRangeMax': 10.56485897394871,
      'outerRangeMin': -4.462808782290011,
      'outerRangeMax': 11.574099190013243
    },
    {
      'date': '2018-07-15T00:00:00Z',
      'avg': 3.7311993656821194,
      'innerRangeMin': -2.6244624933194176,
      'innerRangeMax': 10.086861224683656,
      'outerRangeMin': -4.043445028854892,
      'outerRangeMax': 11.086861224683656
    },
    {
      'date': '2018-07-16T00:00:00Z',
      'avg': 3.696541191242428,
      'innerRangeMin': -2.2716265732354906,
      'innerRangeMax': 9.664708955720346,
      'outerRangeMin': -3.9023484720803676,
      'outerRangeMax': 10.664708955720346
    },
    {
      'date': '2018-07-17T00:00:00Z',
      'avg': 4.210882897542345,
      'innerRangeMin': -1.650601725811721,
      'innerRangeMax': 10.07236752089641,
      'outerRangeMin': -3.4571939014690862,
      'outerRangeMax': 11.406777666131205
    },
    {
      'date': '2018-07-18T00:00:00Z',
      'avg': 4.132223282435189,
      'innerRangeMin': -1.9028460925414397,
      'innerRangeMax': 10.167292657411817,
      'outerRangeMin': -4.059942383547959,
      'outerRangeMax': 11.360495956361186
    },
    {
      'date': '2018-07-19T00:00:00Z',
      'avg': 3.9539130188693368,
      'innerRangeMin': -2.5631783160455712,
      'innerRangeMax': 10.471004353784245,
      'outerRangeMin': -4.691386521520299,
      'outerRangeMax': 11.471004353784245
    },
    {
      'date': '2018-07-20T00:00:00Z',
      'avg': 4.068267549273145,
      'innerRangeMin': -2.227336911304592,
      'innerRangeMax': 10.363872009850882,
      'outerRangeMin': -3.854539963532466,
      'outerRangeMax': 11.363872009850882
    },
    {
      'date': '2018-07-21T00:00:00Z',
      'avg': 3.726279055950845,
      'innerRangeMin': -2.7102977172277254,
      'innerRangeMax': 10.162855829129416,
      'outerRangeMin': -3.9415974018499886,
      'outerRangeMax': 11.162855829129416
    },
    {
      'date': '2018-07-22T00:00:00Z',
      'avg': 3.406014800000206,
      'innerRangeMin': -2.573382639120364,
      'innerRangeMax': 9.385412239120775,
      'outerRangeMin': -4.002261857739434,
      'outerRangeMax': 10.507397806052557
    },
    {
      'date': '2018-07-23T00:00:00Z',
      'avg': 3.7046422216280113,
      'innerRangeMin': -2.6687010550697026,
      'innerRangeMax': 10.077985498325726,
      'outerRangeMin': -4.036558660657625,
      'outerRangeMax': 11.429612350271873
    },
    {
      'date': '2018-07-24T00:00:00Z',
      'avg': 3.626718255399854,
      'innerRangeMin': -3.3262229461011645,
      'innerRangeMax': 10.579659456900872,
      'outerRangeMin': -5.260920835988939,
      'outerRangeMax': 11.859340698988477
    },
    {
      'date': '2018-07-25T00:00:00Z',
      'avg': 3.710145346485008,
      'innerRangeMin': -2.9917907155584254,
      'innerRangeMax': 10.412081408528442,
      'outerRangeMin': -4.908064961115117,
      'outerRangeMax': 11.556126018030136
    },
    {
      'date': '2018-07-26T00:00:00Z',
      'avg': 3.5980802118106374,
      'innerRangeMin': -2.913634146777833,
      'innerRangeMax': 10.109794570399108,
      'outerRangeMin': -4.606027842069423,
      'outerRangeMax': 11.398080898066532
    },
    {
      'date': '2018-07-27T00:00:00Z',
      'avg': 3.0914084415902896,
      'innerRangeMin': -2.87046134788802,
      'innerRangeMax': 9.0532782310686,
      'outerRangeMin': -4.701031540455432,
      'outerRangeMax': 10.0532782310686
    },
    {
      'date': '2018-07-28T00:00:00Z',
      'avg': 3.2124345322972627,
      'innerRangeMin': -2.335955669917761,
      'innerRangeMax': 8.760824734512287,
      'outerRangeMin': -3.852848274346908,
      'outerRangeMax': 9.88929401484773
    }
  ]

// let testData = [
//   {
//     date: '2017-03-15T00:00:00Z',
//     mean: 0.4838268258884837,
//     stdevMin: -0.5997606958217658,
//     stdevMax: 1.5674143475987332,
//     min: -1.5997606958217658,
//     max: 2.914435740768514
//   },
//   {
//     date: '2017-03-16T00:00:00Z',
//     mean: 0.6498042770734018,
//     stdevMin: -0.3501957229265982,
//     stdevMax: 1.6498042770734018,
//     min: -1.3501957229265982,
//     max: 2.6767602566667934
//   },
//   {
//     date: '2017-03-17T00:00:00Z',
//     mean: 0.39657698918555845,
//     stdevMin: -0.6034230108144416,
//     stdevMax: 1.3965769891855584,
//     min: -1.6034230108144416,
//     max: 2.3965769891855584
//   },
//   {
//     date: '2017-03-18T00:00:00Z',
//     mean: 0.4849612531449654,
//     stdevMin: -0.5150387468550346,
//     stdevMax: 1.4849612531449654,
//     min: -1.5150387468550346,
//     max: 2.4849612531449656
//   }
// ]

var parseTime = timeParse('%Y-%m-%dT%H:%M:%SZ')
testData.map((d) => { d.date = parseTime(d.date) })

const chartCommon = {
  margin: {top: 10, right: 10, bottom: 50, left: 50},
  height: 150
}

class SummaryTimelineExample extends React.Component {
  constructor (props) {
    super()
    this.data = testData
  }

  render () {
    return (
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-12'>
            <SummaryTimelineChart {...chartCommon} data={this.data} />
          </div>
        </div>
      </div>
    )
  }
}

export default SummaryTimelineExample
