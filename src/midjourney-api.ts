import axios from 'axios';

export async function addJob(prompt: string) {
    if (prompt.length > 1000) {
        prompt = prompt.substring(0, 999);
    }
    const response = await axios.get(
        process.env.HTTP_ENDPOINT + '/addjob?key=' + process.env.MJ_API_KEY + '&prompt=' + process.env.PRE_PROMPT_THEMEING + ' ' + prompt + ' ' + process.env.PROMPT_THEMEING
    );

    console.log('MIDJOURNEY RESPONSE', response.data);
    return response.data.data;
}

export async function getJob(job_id: string) {
    const response = await axios.get(
        process.env.HTTP_ENDPOINT + '/getjob?job_id=' + job_id
    );

    console.log('MIDJOURNEY RESPONSE', response.data);
    return response.data.data;
}

export async function cancelJob(job_id: string) {
    const response = await axios.get(
        process.env.HTTP_ENDPOINT + '/getjob??key=' + process.env.MJ_API_KEY + '&job_id=' + job_id
    );

    console.log('MIDJOURNEY RESPONSE', response.data);
    return response.data.data;
}

export async function getImage(image_uri: string) {
    axios({
        url: image_uri, //your url
        method: 'GET',
        responseType: 'blob', // important
    }).then((response) => {
        // create file link in browser's memory
        const href = URL.createObjectURL(response.data);
    
        // create "a" HTML element with href to file & click
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', 'file.pdf'); //or any other extension
        document.body.appendChild(link);
        link.click();
    
        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    });
}