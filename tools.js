exports.string_to_slug =  function (str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    var from = "ãàáäâèéëêìíïîõòóöôùúüûñç·/_,:;";
    var to   = "aaaaaeeeeiiiiõoooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}

exports.setCookie = function(cname, cvalue, secounds) {
    const d = new Date();
    d.setTime(d.getTime() + (secounds*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

exports.getCookie = function(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

exports.CTA_Telegram = function(job_subCategory) {
  const GROUPS_MAP = {
    "34850f30-2add-4fcd-b643-acbca0bf0cdf":{
      //Engenharia de Dados
      "name":"Dados",
      "telegram_link":"https://t.me/tickun_vagas_Dados"
    },
    "d6f609ef-1eaf-402d-833f-e136a0082812": {
      //Ciência de Dados
      "name":"Dados",
      "telegram_link":"https://t.me/tickun_vagas_Dados"
    },
    "87ee8835-a314-453c-8a4a-db7ba40c7b92": {
      //Análise de Dados
      "name":"Dados",
      "telegram_link":"https://t.me/tickun_vagas_Dados"
    },
    "f088f4a7-e433-4147-9244-ca34b1c4acd9": {
      //Farmácia
      "name":"Farmácia",
      "telegram_link":"https://t.me/tickun_vagas_farmacia"
    },
    "0f49d7fe-22c3-472d-9f34-b3c2a443021b": {
      //Nutrição
      "name":"Nutrição",
      "telegram_link":""
    },
    "b9a7f375-ea9e-43db-8e92-2fef38bad7ea": {
      //Fisioterapia
      "name":"Fisioterapia",
      "telegram_link":""
    },
    "f1276440-916a-443d-b164-05d643b0b7ab": {
      //Medicina
      "name":"Medicina",
      "telegram_link":""
    },
    "6a7d0615-62d5-40d0-8b09-fea3b709baaf": {
      //Odontologia
      "name":"Odonto",
      "telegram_link":"https://t.me/tickun_vagas_dentista"
    },
    "eb2b408f-1ced-4fb8-875b-80083cf3537e": {
      //Vendas
      "name":"Comercial",
      "telegram_link":""
    },
    "fd8397f9-6c5d-454c-ac5d-1b1e1ca1a446": {
      //Crédito e Cobrança
      "name":"Financeiro",
      "telegram_link":""
    },
    "60b047f6-cfd2-41b4-9709-5fbf8eef1aa5": {
      //Infra Estrutura
      "name":"TI",
      "telegram_link":"https://t.me/tickun_vagas_ti"
    },
    "aed707a5-11dc-43d9-beaf-e08c18990d17": {
      //Desenvolvimento
      "name":"TI",
      "telegram_link":"https://t.me/tickun_vagas_ti"
    },
    "d0319b44-0d4e-4e70-8888-d954e2658783": {
      //Sistemas
      "name":"TI",
      "telegram_link":"https://t.me/tickun_vagas_ti"
    },
    "dfaf973e-4eab-4eac-a2d8-6833a30d0dc0": {
      //Inteligência Comercial
      "name":"Comercial",
      "telegram_link":""
    },
    "f928b177-0ab4-469e-a6f6-d6bbcefc59a1": {
      //Clientes
      "name":"Comercial",
      "telegram_link":""
    },
    "50a64c67-c53e-4665-ba6a-de219f3a183d": {
      //Segurança
      "name":"TI",
      "telegram_link":""
    },
  }


  return GROUPS_MAP[job_subCategory]
}

exports.JobsTools = {
  buildStrucData: function(job){
    const jobDescription = `
      <p>Descrição</p>
      <br>
      ${ job.description }

      <br>
      <br>

      <p>Principais Atividades</p>
      <br>
      ${ job.mainActivities }

      <br>
      <br>

      <p>Requisitos Obrigatórios</p>
      <br>
      ${ job.mandatoryReqs }

      <br>
      <br>

      <p>Diferenciais</p>
      <br>
      ${ job.differentials }
    `;

    var employmentType = [];
    var jobLocationType = "";
    for(let type of job.__types__){
      switch( type.name ){
        case 'Período Integral':
          employmentType.push("FULL_TIME");
          break;
        case 'Meio Período':
          employmentType.push("PART_TIME");
          break;
        case 'Pessoa Jurídica':
          employmentType.push("CONTRACTOR");
          break;
        case 'Temporário':
          employmentType.push("TEMPORARY");
          break;
        case 'Estágio':
          employmentType.push("INTERN");
          break;
        case 'Meio Período':
          employmentType.push("PART_TIME");
          break;
        case 'Remoto':
          jobLocationType = 'TELECOMMUTE';
          break;
        default:
          null;
      }
    }

    var structuredData = {
      "@context" : "https://schema.org/",
      "@type" : "JobPosting",
      "title" : job.title,
      "description" : jobDescription,
      "datePosted" : job.createdAt,
      "validThrough" : job.expirationDate,

      "identifier": {
        "@type": "PropertyValue",
        "name":  job.__organization__.name,
        "value":  job.__organization__.code
      },
      "hiringOrganization" : {
        "@type" : "Organization",
        "name" : job.__organization__.name,
        "sameAs" : job.__organization__.site || "",
        "logo" : job.__organization__.logoUrl || ""
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "BR",
          "addressRegion": job.state,
          "addressLocality": job.city
        }
      },
      "employmentType": employmentType,
      "baseSalary":{
        "@type": "MonetaryAmount",
        "currency": "BRL",
        "value":{
          "@type": "QuantitativeValue",
          "value": (job.salary > 0 ? job.salary : ""),
          "unitText": "MONTH"
        }
      }
    };

    if( jobLocationType && jobLocationType.replace(" ","") !== "" ) {
      structuredData["jobLocationType"] = jobLocationType;
      structuredData["applicantLocationRequirements"] = {
        "@type": "Country",
        "name": "Brasil"
      };
    }

    return structuredData
  },

  getHowLong(initialTime, endTime=null){
    if ( !endTime ) { endTime = new Date() };
    var passedHours = Math.trunc(((endTime - initialTime)/( 1000 * 60 * 60)));
    var passedDays = Math.trunc(passedHours/24);
    var howLog;
    if ( passedHours < 24){
      howLog = `Há ${ passedHours } ${ passedHours === 1 ? "hora" : "horas"}`;
    }
    else if ( passedDays < 7 ){
      howLog = `Há ${ passedDays } ${ passedDays === 1 ? "dia" : "dias"}`;
    }
    else if ( passedDays < 30 ){
      howLog =  `Há ${ Math.trunc(passedDays/7) } ${ Math.trunc(passedDays/7) === 1 ? "semana" : "semanas" }`
    }
    else{
      howLog =  `Há ${ Math.trunc(passedDays/30) } ${ Math.trunc(passedDays/30) === 1 ? "Mês" : "Meses" }`
    }
    return {time: passedDays, text: howLog}
  }
}