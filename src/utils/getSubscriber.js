import $ from 'jquery';

export function getSubscriber(id, outputFn)
{
    return {
        next(x)
        {
            if (outputFn === undefined)
            {
                $(document.body).append(`<p>${id}: ${x}</p>`);
            }
            else
            {
                $(document.body).append(`<p>${id}: ${outputFn(x)}</p>`);
            }
        },
        error(error)
        {
            $(document.body).append(`<p style="color:red">${id}: ${error.message}</p><hr>`);
        },
        complete()
        {
            $(document.body).append(`<p>${id}: Completed!<p><hr>`);
        }
    };
}