define(['layout/module', 'lodash'], function(module, _) {
  'use strict';

  return module.registerDirective('smartWizard', function() {
    return {
      restrict: 'A',
      scope: {
        'smartWizardCallback': '&',
        'smartStepCallback': '&'
      },
      link: function(scope, element, attributes) {
        var stepsCount = $('[data-smart-wizard-tab]').length;
        var currentStep = 1;
        var validSteps = [];

        var $form = element.closest('form');
        var $prev = $('[data-smart-wizard-prev]', element);
        var $next = $('[data-smart-wizard-next]', element);

        function setStep(step) {
          currentStep = step;
          $('[data-smart-wizard-pane=' + step + ']', element)
            .addClass('active').siblings('[data-smart-wizard-pane]').removeClass('active');
          $('[data-smart-wizard-tab=' + step + ']', element)
            .addClass('active').siblings('[data-smart-wizard-tab]').removeClass('active');

          $prev.toggleClass('disabled', step == 1);

          if(typeof scope.smartStepCallback() === 'function') {
            var data = {};
            _.each($form.serializeArray(), function(field) {
              data[field.name] = field.value;
            });
            scope.smartStepCallback()(currentStep, data);
          }
        }

        element.on('click', '[data-smart-wizard-tab]', function(e) {
          var step = parseInt($(this).data('smartWizardTab'));
          if ($form.data('validator')) {
            if (!$form.valid()) {
              validSteps = _.without(validSteps, currentStep);
              $form.data('validator').focusInvalid();
              return false;
            } else {
              validSteps = _.without(validSteps, currentStep);
              validSteps.push(currentStep);
              element.find('[data-smart-wizard-tab=' + currentStep + ']')
                .addClass('complete')
                .find('.step')
                .html('<i class="fa fa-check"></i>');
              setStep(step);
              e.preventDefault();
            }
          } else {
            setStep(step);
            e.preventDefault();
          }
        });

        $next.on('click', function(e) {
          if ($form.data('validator')) {
            if (!$form.valid()) {
              validSteps = _.without(validSteps, currentStep);
              $form.data('validator').focusInvalid();
              return false;
            } else {
              validSteps = _.without(validSteps, currentStep);
              validSteps.push(currentStep);
              element.find('[data-smart-wizard-tab=' + currentStep + ']')
                .addClass('complete')
                .find('.step')
                .html('<i class="fa fa-check"></i>');
            }
          }
          if (currentStep < stepsCount) {
            setStep(currentStep + 1);
          } else {
            if (validSteps.length < stepsCount) {
              var steps = _.range(1, stepsCount + 1);
              _(steps).forEach(function(num) {
                if (validSteps.indexOf(num) == -1) {
                  setStep(num);
                  return false;
                }
              });
            } else {
              var data = {};
              _.each($form.serializeArray(), function(field) {
                data[field.name] = field.value;
              });
              if(typeof scope.smartWizardCallback() === 'function') {
                scope.smartWizardCallback()(data);
              }
            }
          }

          e.preventDefault();
        });

        $prev.on('click', function(e) {
          if (!$prev.hasClass('disabled') && currentStep > 0) {
            setStep(currentStep - 1);
          }
          e.preventDefault();
        });

        setStep(currentStep);
      }
    }
  });
});