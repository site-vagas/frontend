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