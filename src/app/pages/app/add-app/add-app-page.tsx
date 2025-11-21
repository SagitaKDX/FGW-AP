import { Container } from '@/app/components/common/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { useFapData } from '@/app/providers/fap-data-provider';
import { Fragment, useEffect } from 'react';
import { useAddApp } from './use-add-app';
import { useIntl } from 'react-intl';

const AddAppPage = () => {
  const { loading } = useFapData();
  const { formHtml, viewStateValue, viewStateGeneratorValue, eventValidationValue } = useAddApp();
  const intl = useIntl();

  // Add __doPostBack function for ASP.NET postbacks
  useEffect(() => {
    const theForm = document.forms['aspnetForm'] || document.querySelector('form[action*="AddApp.aspx"]');
    
    if (!(window as any).__doPostBack) {
      (window as any).__doPostBack = function(eventTarget: string, eventArgument: string) {
        const form = theForm as HTMLFormElement;
        if (!form) return;
        
        if (!form.onsubmit || (form.onsubmit() !== false)) {
          const eventTargetInput = form.querySelector('#__EVENTTARGET') as HTMLInputElement;
          const eventArgumentInput = form.querySelector('#__EVENTARGUMENT') as HTMLInputElement;
          
          if (eventTargetInput) eventTargetInput.value = eventTarget;
          if (eventArgumentInput) eventArgumentInput.value = eventArgument;
          
          form.submit();
        }
      };
    }
  }, []);

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </Container>
    );
  }

  return (
    <Fragment>
      <Container>
        <Card className="shadow-sm overflow-hidden mb-8">
          <CardHeader>
            <CardTitle>
              {intl.formatMessage({ id: 'MENU.STUDENT_CONFIRMATION' }, { defaultMessage: 'Verification student\'s status' })}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form method="post" action="./AddApp.aspx" encType="multipart/form-data">
              <input type="hidden" name="__EVENTTARGET" id="__EVENTTARGET" value="" />
              <input type="hidden" name="__EVENTARGUMENT" id="__EVENTARGUMENT" value="" />
              <input type="hidden" name="__LASTFOCUS" id="__LASTFOCUS" value="" />
              <input type="hidden" name="__VIEWSTATE" id="__VIEWSTATE" value={viewStateValue} />
              <input type="hidden" name="__VIEWSTATEGENERATOR" id="__VIEWSTATEGENERATOR" value={viewStateGeneratorValue} />
              <input type="hidden" name="__EVENTVALIDATION" id="__EVENTVALIDATION" value={eventValidationValue} />

              <div dangerouslySetInnerHTML={{ __html: formHtml }} />
            </form>
          </CardContent>
        </Card>
      </Container>
    </Fragment>
  );
};

export { AddAppPage };

