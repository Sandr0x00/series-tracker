/* exported registerTooltip */

function registerTooltip () {
    $('[data-toggle="tooltip"]').tooltip({
        placement: 'top',
        container: 'body',
        offset: '0, -100%',
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>'
    });
}