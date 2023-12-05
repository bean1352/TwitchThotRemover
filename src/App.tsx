import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash } from 'lucide-react'
import { ThemeProvider } from '@/components/theme-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // Access the data sent from the extension
  console.log(message.data); // "Hello from the extension!"

  // You can also send a response back to the extension if needed
  sendResponse("Message received!");
});

function App() {
  const [bannedTitles, setBannedTitles] = useState<string[]>([]);
  const [newWord, setNewWord] = useState<string>('');
  // const [bannedTags, setBannedTags] = useState<string[]>([]);
  // const [newTag, setNewTag] = useState<string>('');

  useEffect(() => {
    chrome.storage.sync.get('bannedWords', function (data) {
      setBannedTitles(data.bannedWords);
    })
    // chrome.storage.sync.get('bannedTags', function (data) {
    //   setBannedTags(data.bannedTags);
    // })
  }, [])


  return (
    <ThemeProvider defaultTheme="dark">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Thot Remover</CardTitle>
          <CardDescription>Remove thots from your life</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="title">
            <TabsList>
              <TabsTrigger value="title">Title</TabsTrigger>
              <TabsTrigger value="tags">Tags</TabsTrigger>
            </TabsList>
            <TabsContent value="title">
              <ScrollArea className="rounded-md border max-h-72 overflow-y-auto" >
                <div className="pt-4">
                  <h4 className="ml-4 mb-4 text-sm font-medium leading-none">Titles that include:</h4>
                  <Separator />
                  {bannedTitles?.map((tag, i) => (
                    <>
                      <div key={i} className="ml-4 flex justify-between items-center">
                        <span className='text-base'>{tag}</span>
                        <Button variant="ghost" className='p-0 w-10' onClick={() => {
                          const updatedTitles = bannedTitles.filter((word) => word !== tag);
                          console.log("new words", updatedTitles);
                          chrome.storage.sync.set({ bannedWords: updatedTitles });
                          setBannedTitles(updatedTitles);
                          chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                            chrome.tabs.sendMessage(tabs[0].id ?? 0, { titles: updatedTitles });
                          });
                        }}>
                          <Trash size={16} />
                        </Button>
                      </div>
                      {i !== bannedTitles.length - 1 &&
                        <Separator />}
                    </>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex items-end mt-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  {/* <Label htmlFor="blacklist-word">Blacklist Title</Label> */}
                  <Input type="text" id="blacklist-word" placeholder="Title..." onChange={
                    (e) => {
                      setNewWord(e.target.value);
                    }
                  } value={newWord}
                  />
                </div>
                <Button
                  className='ml-2 w-12 p-0'
                  onClick={() => {
                    const updatedWords = [...bannedTitles, newWord];

                    // Update the state immediately to reflect the change in the UI
                    setBannedTitles(updatedWords);
                    setNewWord('');

                    // Update the storage, then send the message
                    chrome.storage.sync.set({ bannedWords: updatedWords }, function () {
                      console.log('Value is set to ' + updatedWords);
                    });

                    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                      chrome.tabs.sendMessage(tabs[0].id ?? 0, { titles: updatedWords });
                    });
                  }}
                >
                  <Plus size={18} />
                </Button>
              </div>

            </TabsContent>
            <TabsContent value="tags">
              {/* <ScrollArea className="rounded-md border max-h-72 overflow-y-auto" >
                <div className="pt-4">
                  <h4 className="ml-4 mb-4 text-sm font-medium leading-none">Titles that include:</h4>
                  <Separator />
                  {bannedTags?.map((tag, i) => (
                    <>
                      <div key={i} className="ml-4 flex justify-between items-center">
                        <span className='text-base'>{tag}</span>
                        <Button variant="ghost" className='p-0 w-10' onClick={() => {
                          const updatedTags = bannedTags.filter((word) => word !== tag);
                          console.log("new words", updatedTags);
                          chrome.storage.sync.set({ bannedWords: updatedTags });
                          setBannedTitles(updatedTags);
                          chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                            chrome.tabs.sendMessage(tabs[0].id ?? 0, { tags: updatedTags });
                          });
                        }}>
                          <Trash size={16} />
                        </Button>
                      </div>
                      {i !== bannedTitles.length - 1 &&
                        <Separator />}
                    </>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex items-end mt-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Input type="text" id="blacklist-word" placeholder="Title..." onChange={
                    (e) => {
                      setNewTag(e.target.value);
                    }
                  } value={newWord}
                  />
                </div>
                <Button
                  className='ml-2 w-12 p-0'
                  onClick={() => {
                    const updatedTags = [...bannedTags, newWord];

                    // Update the state immediately to reflect the change in the UI
                    setBannedTags(updatedTags);
                    setNewTag('');

                    // Update the storage, then send the message
                    chrome.storage.sync.set({ bannedWords: updatedTags }, function () {
                      console.log('Value is set to ' + updatedTags);
                    });

                    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                      chrome.tabs.sendMessage(tabs[0].id ?? 0, { tags: updatedTags });
                    });
                  }}
                >
                  <Plus size={18} />
                </Button>
              </div> */}
            </TabsContent>
          </Tabs>


        </CardContent>
      </Card>
    </ThemeProvider>
  )
}

export default App
